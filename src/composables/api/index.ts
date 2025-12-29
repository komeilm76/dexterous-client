import { z } from "zod";
import kmApi from "km-api";
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

export const useApi = <CONFIG extends ReturnType<typeof kmApi.makeApiConfig>>(
  config: CONFIG,
  options: (v: CONFIG) => {
    order: ReturnType<CONFIG["makeParamsOrderedList"]>;
    cacheTime?: number | undefined;
  },
) => {
  let cachedOptions: {
    body?: z.infer<CONFIG["request"]["body"]>;
    params?: z.infer<CONFIG["request"]["params"]>;
    query?: z.infer<CONFIG["request"]["query"]>;
    orders?: ReturnType<CONFIG["makeParamsOrderedList"]> | [];
  } = {};
  let firstOptions:
    | {
        body?: z.infer<CONFIG["request"]["body"]>;
        params?: z.infer<CONFIG["request"]["params"]>;
        query?: z.infer<CONFIG["request"]["query"]>;
        orders?: ReturnType<CONFIG["makeParamsOrderedList"]> | [];
      }
    | undefined = undefined;
  const { hook, http } = useHttp();
  // const orders = ref<ReturnType<CONFIG["makeParamsOrderedList"]> | []>([]);
  // const body = ref<ReturnType<CONFIG["makeBody"]> | {}>({});
  // const params = ref<z.infer<CONFIG["request"]["params"]> | {}>({});
  // const queries = ref<ReturnType<CONFIG["makeQueries"]> | {}>({});

  const method = hook.useRequest(
    (
      body?: z.infer<CONFIG["request"]["body"]>,
      params?: z.infer<CONFIG["request"]["params"]>,
      query?: z.infer<CONFIG["request"]["query"]>,
      loadFromCache?: boolean | undefined,
    ) => {
      const cacheTime = options(config).cacheTime;
      cachedOptions = { body, params, query, orders: options(config).order };

      if (firstOptions == undefined) {
        firstOptions = _.cloneDeep({
          body,
          params,
          query,
          orders: options(config).order,
        });
      }

      return http.Request<
        IResponseSuccessShape<z.infer<CONFIG["response"]["success"]>>
      >({
        url: config.makeFullPath(params, options(config).order),
        method: config.method,
        meta: {
          auth: config.auth,
        },
        ...(config.responseType == "blob" && { responseType: "blob" }),
        data: body as unknown as any,
        params: query || {},
        ...(cacheTime == undefined ? {} : { cacheFor: cacheTime }),
        ...(loadFromCache == undefined
          ? {}
          : loadFromCache == false
            ? { cacheFor: 0 }
            : {}),
      });
    },
    { immediate: false },
  );

  const reloadWithLastOptions = (loadFromCache?: boolean | undefined) => {
    method.send(
      cachedOptions.body,
      cachedOptions.params,
      cachedOptions.query,
      loadFromCache,
    );
  };

  const reloadWithFirstOptions = (loadFromCache?: boolean | undefined) => {
    if (firstOptions) {
      method.send(
        firstOptions.body,
        firstOptions.params,
        firstOptions.query,
        loadFromCache,
      );
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
