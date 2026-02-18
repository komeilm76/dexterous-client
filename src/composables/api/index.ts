import { z, ZodObject } from "zod";
import { kmApi } from "km-api";
import { useHttp } from "../http";
import _ from "lodash";
import { computed, ref, watchEffect } from "vue";
import type { AxiosError } from "axios";
type IErrorShape = {};

type IResponseSuccessShape<DATA> = {
  data: DATA;
  status: number;
  statusText: string;
};

export const useApi = <
  CONFIG extends ReturnType<typeof kmApi.v4.makeApiConfig>,
>(
  config: CONFIG,
  http_options: (v: CONFIG) => {
    cacheTime?: number | undefined;
    limit?: number | undefined;
    retry?: number | undefined;
  },
) => {
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
      const cacheTime = http_options(config).cacheTime;
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

      const adapterResponseType = kmApi.adapters.convertResponseType(
        config.responseContentType || "application/json",
        "alova-axios",
      );

      return http.Request<
        IResponseSuccessShape<z.infer<CONFIG["response"]["success"]>>
      >({
        url: config.makeFullPath(requestConfig.params || {}),
        method: config.method,
        meta: {
          auth: config.auth,
        },
        data: requestConfig.body as unknown as any,
        ...(requestConfig.query
          ? { params: requestConfig.params }
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
    return output as AxiosError<z.infer<CONFIG["response"]["error"]>>;
  });

  return {
    method,
    config,
    reloadWithLastOptions,
    reloadWithFirstOptions,
    uploadData: {
      info: uploadInfo,
      status: uploadStatus,
    },
    error,
  };
};
