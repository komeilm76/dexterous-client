import { z, ZodObject } from "zod";
import { useHttp } from "../http";
import _ from "lodash";
import { computed, ref, watch, watchEffect } from "vue";
import type { AxiosError } from "axios";
import { useAppToast } from "@/stores/application/toast";
import { useAppJwt } from "@/stores/application/jwt";
import { useRouter } from "vue-router";
import { convertResponseType, makeApiConfig } from "km-api";
type IErrorShape = {};

type IResponseSuccessShape<DATA> = {
  data: DATA;
  status: number;
  statusText: string;
};

type _IResponseSuccessShape<
  RESPONSE extends ReturnType<typeof makeApiConfig>["response"],
  STATUS extends keyof RESPONSE = keyof RESPONSE,
> = {
  data: z.infer<RESPONSE[STATUS]>;
  status: STATUS;
  statusText: string;
};

type IHttpOptions = {
  cacheTime: number;
};

export const useApi = <CONFIG extends ReturnType<typeof makeApiConfig>>(
  config: CONFIG,
  http_options: (v: CONFIG) => Partial<IHttpOptions> | void,
) => {
  const appJwt = useAppJwt();
  const appToast = useAppToast();
  const router = useRouter();

  let cachedOptions: {
    body?: z.infer<CONFIG["request"]["body"]>;
    params?: z.infer<CONFIG["request"]["params"]>;
    query?: z.infer<CONFIG["request"]["query"]>;
    cookies?: z.infer<CONFIG["request"]["cookies"]>;
    headers?: z.infer<CONFIG["request"]["headers"]>;
  } = {};
  let firstOptions:
    | {
        body?: z.infer<CONFIG["request"]["body"]>;
        params?: z.infer<CONFIG["request"]["params"]>;
        query?: z.infer<CONFIG["request"]["query"]>;
        cookies?: z.infer<CONFIG["request"]["cookies"]>;
        headers?: z.infer<CONFIG["request"]["headers"]>;
      }
    | undefined = undefined;
  const { hook, http } = useHttp();

  const method = hook.useRequest(
    (requestConfig: {
      body?: z.infer<CONFIG["request"]["body"]>;
      params?: z.infer<CONFIG["request"]["params"]>;
      query?: z.infer<CONFIG["request"]["query"]>;
      cookies?: z.infer<CONFIG["request"]["cookies"]>;
      headers?: z.infer<CONFIG["request"]["headers"]>;
      loadFromCache?: boolean | undefined;
    }) => {
      console.log("requestConfig", requestConfig);

      const httpEntryOptions = http_options(config);
      const httpDefaultOptions: IHttpOptions = { cacheTime: 0 };
      const httpFinalyOptions: IHttpOptions = {
        ...httpDefaultOptions,
        ...(typeof httpEntryOptions == "object" && httpEntryOptions),
      };
      const cacheTime = httpFinalyOptions.cacheTime;
      cachedOptions = {
        body: requestConfig.body,
        params: requestConfig.params,
        query: requestConfig.query,
      };

      if (firstOptions == undefined) {
        firstOptions = _.cloneDeep({
          body: requestConfig.body,
          params: requestConfig.params,
          query: requestConfig.query,
          cookies: requestConfig.cookies,
          headers: requestConfig.headers,
        });
      }

      const adapterResponseType = convertResponseType(
        config.responseContentType || "application/json",
        "alova-axios",
      );

      return http.Request<_IResponseSuccessShape<CONFIG["response"]>>({
        url: config.makeFullPath(requestConfig.params || {}),
        method: config.method,
        meta: {
          auth: config.auth,
        },
        data: requestConfig.body as unknown as any,
        ...(requestConfig.query
          ? { params: requestConfig.query }
          : { params: {} }),
        ...(requestConfig.headers && { headers: requestConfig.headers as any }),
        ...(adapterResponseType.responseType && {
          responseType: adapterResponseType.responseType,
        }),
        ...(cacheTime == undefined ? {} : { cacheFor: cacheTime }),
        ...(requestConfig.loadFromCache == undefined
          ? {}
          : requestConfig.loadFromCache == false
            ? { cacheFor: 0 }
            : {}),
      });
    },
    { immediate: false },
  );

  method.onError((res) => {
    console.log("error in api composable", res);
    if (res.error.code == "ERR_NETWORK") {
      appToast.service?.error({
        title: res.error.message,
        messages: [
          "We’re unable to connect right now. Please check your connection and try again.",
        ],
        showTime: 6000,
      });
    }

    if (res.error.status == 401) {
      appJwt.logout(() => {
        router.push("/log/authChecker");
      });
    }
  });

  const reloadWithLastOptions = (loadFromCache?: boolean | undefined) => {
    method.send({
      body: cachedOptions.body,
      params: cachedOptions.params,
      query: cachedOptions.query,
      cookies: cachedOptions.cookies,
      headers: cachedOptions.headers,
      loadFromCache,
    });
  };

  const reloadWithFirstOptions = (loadFromCache?: boolean | undefined) => {
    if (firstOptions) {
      method.send({
        body: firstOptions.body,
        params: firstOptions.params,
        query: firstOptions.query,
        cookies: firstOptions.cookies,
        headers: firstOptions.headers,
        loadFromCache,
      });
    }
  };

  const percentOfLoadedController = (
    total: number,
    loaded: number,
    percitionLength: number = 2,
  ) => {
    let validLoaded = 0;
    if (loaded == 0 && total == 0) {
      validLoaded = 0;
    } else {
      validLoaded = (100 * loaded) / total;
    }
    if (validLoaded == 0) {
      return 0;
    } else if (validLoaded == 100) {
      return 100;
    } else {
      return Number(validLoaded.toFixed(percitionLength));
    }
  };
  const uploadInfo = computed(() => {
    const { loaded, total } = method.uploading.value;
    // loaded-size - total-size
    // loaded-percent - 100-percent
    return {
      loadedSize: loaded,
      totalSize: total,
      loadedPercent: percentOfLoadedController(total, loaded, 2),
      uploading: loaded == total ? false : true,
    };
  });
  const uploadStatus = ref<"NO" | "UPLOADING" | "YES" | "YES_AFTER_MOMENT">(
    "NO",
  );

  watchEffect(() => {
    if (uploadInfo.value.uploading == true) {
      if (
        uploadInfo.value.loadedPercent > 0 &&
        uploadInfo.value.loadedPercent < 100
      ) {
        uploadStatus.value = "UPLOADING";
      } else if (uploadInfo.value.loadedPercent == 0) {
        uploadStatus.value = "UPLOADING";
      } else if (uploadInfo.value.loadedPercent == 100) {
        uploadStatus.value = "UPLOADING"; //maybe yes
      } else {
        uploadStatus.value = "UPLOADING";
      }
    } else {
      if (uploadInfo.value.loadedPercent == 100) {
        uploadStatus.value = "YES";
        setTimeout(() => {
          uploadStatus.value = "YES_AFTER_MOMENT";
        }, 3000);
      } else if (uploadInfo.value.loadedPercent == 0) {
        uploadStatus.value = "NO";
      } else {
        uploadStatus.value = "NO";
      }
    }
  });

  const error = computed(() => {
    const output = method.error.value;
    return output as AxiosError<z.infer<CONFIG["response"]["400"]>>;
  });

  const errorMessage = computed(() => {
    if (error && "meesage" in error) {
      return error.meesage;
    }
  });

  // just support status code 200
  const _data =
    ref<IResponseSuccessShape<z.infer<CONFIG["response"]["200"]>>>();
  watch(method.data, (n, o) => {
    console.log(n);
    _data.value = n.data as IResponseSuccessShape<
      z.infer<CONFIG["response"]["200"]>
    >;
  });

  // #prompt
  // support all status codes near them. after im using a condition on status == "200" , i cant give just intelisense of 200 response.
  // i want after my condition of status , show intelisense of response data confortable with status code.
  const __data = ref<_IResponseSuccessShape<CONFIG["response"]>>();

  const getRequestLastOptions = () => {
    return cachedOptions;
  };

  return {
    method,
    _data,
    __data,
    config,
    reloadWithLastOptions,
    reloadWithFirstOptions,
    getRequestLastOptions,
    uploadData: {
      info: uploadInfo,
      status: uploadStatus,
    },
    error,
    errorMessage,
  };
};
