import { z } from "zod";
import kmApi from "km-api";
import { useHttp } from "../http";
import _ from "lodash";
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
  }
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
      loadFromCache?: boolean | undefined
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
        IResponseSuccessShape<z.infer<CONFIG["response"]["data"]>>
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
    { immediate: false }
  );

  const reloadWithLastOptions = (loadFromCache?: boolean | undefined) => {
    method.send(
      cachedOptions.body,
      cachedOptions.params,
      cachedOptions.query,
      loadFromCache
    );
  };

  const reloadWithFirstOptions = (loadFromCache?: boolean | undefined) => {
    if (firstOptions) {
      method.send(
        firstOptions.body,
        firstOptions.params,
        firstOptions.query,
        loadFromCache
      );
    }
  };
  return { method, config, reloadWithLastOptions, reloadWithFirstOptions };
};
