import { z } from "zod";
import { useHttp } from "../http";
import _ from "lodash";
import { computed, ref, watch, watchEffect } from "vue";
import type { AxiosError } from "axios";
import { useAppToast } from "@/stores/application/toast";
import { useAppJwt } from "@/stores/application/jwt";
import { useRouter } from "vue-router";
import { convertResponseType, makeApiConfig } from "km-api";

// ─── Module-level types ───────────────────────────────────────────────────────

type _IResponseShape<
  RESPONSE extends ReturnType<typeof makeApiConfig>["response"],
> = {
  [STATUS in keyof RESPONSE]: {
    status: STATUS;
    data: z.infer<RESPONSE[STATUS]>;
    statusText: string;
  };
}[keyof RESPONSE];

type IHttpOptions = { cacheTime: number };

type MatchHandlers<SHAPE extends { status: PropertyKey; data: unknown }> = {
  [K in SHAPE["status"]]?: (
    data: Extract<SHAPE, { status: K }>["data"],
  ) => void;
};

// ─── Composable ───────────────────────────────────────────────────────────────

export const useApi = <CONFIG extends ReturnType<typeof makeApiConfig>>(
  config: CONFIG,
  http_options: (v: CONFIG) => Partial<IHttpOptions> | void,
) => {
  const appJwt = useAppJwt();
  const appToast = useAppToast();
  const router = useRouter();

  // ── Request options cache ──────────────────────────────────────────────────

  type RequestOptions = {
    body?: z.infer<CONFIG["request"]["body"]>;
    params?: z.infer<CONFIG["request"]["params"]>;
    query?: z.infer<CONFIG["request"]["query"]>;
    cookies?: z.infer<CONFIG["request"]["cookies"]>;
    headers?: z.infer<CONFIG["request"]["headers"]>;
  };

  let cachedOptions: RequestOptions = {};
  let firstOptions: RequestOptions | undefined = undefined;

  // ── HTTP method ───────────────────────────────────────────────────────────

  const { hook, http } = useHttp();

  const method = hook.useRequest(
    (requestConfig: RequestOptions & { loadFromCache?: boolean }) => {
      const httpEntryOptions = http_options(config);
      const httpDefaultOptions: IHttpOptions = { cacheTime: 0 };
      const httpFinalyOptions: IHttpOptions = {
        ...httpDefaultOptions,
        ...(typeof httpEntryOptions === "object" && httpEntryOptions),
      };

      cachedOptions = {
        body: requestConfig.body,
        params: requestConfig.params,
        query: requestConfig.query,
      };

      if (firstOptions === undefined) {
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

      return http.Request<_IResponseShape<CONFIG["response"]>>({
        url: config.makeFullPath(requestConfig.params || {}),
        method: config.method,
        meta: { auth: config.auth },
        data: requestConfig.body as unknown as any,
        ...(requestConfig.query
          ? { params: requestConfig.query }
          : { params: {} }),
        ...(requestConfig.headers && { headers: requestConfig.headers as any }),
        ...(adapterResponseType.responseType && {
          responseType: adapterResponseType.responseType,
        }),
        cacheFor: httpFinalyOptions.cacheTime,
        ...(requestConfig.loadFromCache === false && { cacheFor: 0 }),
      });
    },
    { immediate: false },
  );

  // ── Error handling ────────────────────────────────────────────────────────

  method.onError((res) => {
    console.log("error in api composable", res);
    if (res.error.code === "ERR_NETWORK") {
      appToast.service?.error({
        title: res.error.message,
        messages: [
          "We're unable to connect right now. Please check your connection and try again.",
        ],
        showTime: 6000,
      });
    }
    if (res.error.status === 401) {
      appJwt.logout(() => router.push("/log/authChecker"));
    }
  });

  // ── Reload helpers ────────────────────────────────────────────────────────

  const reloadWithLastOptions = (loadFromCache?: boolean) => {
    method.send({ ...cachedOptions, loadFromCache });
  };

  const reloadWithFirstOptions = (loadFromCache?: boolean) => {
    if (firstOptions) method.send({ ...firstOptions, loadFromCache });
  };

  const getRequestLastOptions = () => cachedOptions;

  // ── Upload progress ───────────────────────────────────────────────────────

  const calcPercent = (total: number, loaded: number, precision = 2) => {
    if (loaded === 0 && total === 0) return 0;
    const pct = (100 * loaded) / total;
    if (pct === 0) return 0;
    if (pct === 100) return 100;
    return Number(pct.toFixed(precision));
  };

  const uploadInfo = computed(() => {
    const { loaded, total } = method.uploading.value;
    return {
      loadedSize: loaded,
      totalSize: total,
      loadedPercent: calcPercent(total, loaded),
      uploading: loaded !== total,
    };
  });

  const uploadStatus = ref<"NO" | "UPLOADING" | "YES" | "YES_AFTER_MOMENT">(
    "NO",
  );

  watchEffect(() => {
    const { uploading, loadedPercent } = uploadInfo.value;
    if (uploading) {
      uploadStatus.value = "UPLOADING";
    } else if (loadedPercent === 100) {
      uploadStatus.value = "YES";
      setTimeout(() => {
        uploadStatus.value = "YES_AFTER_MOMENT";
      }, 3000);
    } else {
      uploadStatus.value = "NO";
    }
  });

  // ── Error accessors ───────────────────────────────────────────────────────

  const error = computed(
    () => method.error.value as AxiosError<z.infer<CONFIG["response"]["400"]>>,
  );

  const errorMessage = computed(() => {
    if (error.value && "message" in error.value) return error.value.message;
  });

  // ── Response shape types ──────────────────────────────────────────────────

  type ResponseShape = _IResponseShape<CONFIG["response"]>;

  // 2xx statuses — successful responses
  type SuccessShape = Extract<ResponseShape, { status: `2${string}` }>;

  // 4xx / 5xx statuses — error responses
  type FailShape = Extract<
    ResponseShape,
    { status: `4${string}` | `5${string}` }
  >;

  // ── Type predicates ───────────────────────────────────────────────────────

  const isSuccessStatus = (data: ResponseShape): data is SuccessShape =>
    String(data.status)[0] === "2";

  const isFailStatus = (data: ResponseShape): data is FailShape => {
    const first = String(data.status)[0];
    return first === "4" || first === "5";
  };

  // ── Dispatch (shared runtime core) ───────────────────────────────────────

  const _dispatch = <SHAPE extends ResponseShape>(
    response: SHAPE,
    handlers: MatchHandlers<SHAPE>,
  ) => {
    const handler = handlers[response.status as keyof typeof handlers];
    if (handler) (handler as (data: unknown) => void)(response.data);
  };

  // ── Match functions ───────────────────────────────────────────────────────

  /** Route a response to its handler. All status codes are eligible. */
  const matchStatus = (
    response: ResponseShape,
    handlers: MatchHandlers<ResponseShape>,
  ) => _dispatch(response, handlers);

  /** Route a response to its handler. Only 2xx statuses reach a handler. */
  const matchSuccessStatus = (
    response: ResponseShape,
    handlers: MatchHandlers<SuccessShape>,
  ) => {
    if (isSuccessStatus(response)) _dispatch(response, handlers);
  };

  /** Route a response to its handler. Only 4xx / 5xx statuses reach a handler. */
  const matchFailStatus = (
    response: ResponseShape,
    handlers: MatchHandlers<FailShape>,
  ) => {
    if (isFailStatus(response)) _dispatch(response, handlers);
  };

  // ── Reactive snapshot ─────────────────────────────────────────────────────

  /** Discriminated-union ref of the last successful response.
   *  Narrow on `status` to get the correctly-typed `data`:
   *  @example
   *  if (api._data.value?.status === "201") { api._data.value.data.id }
   */
  const _data = ref<ResponseShape>();
  watch(method.data, (n) => {
    if (n != null) _data.value = n as ResponseShape;
  });

  // ── Short-path event handlers ─────────────────────────────────────────────

  /** Register a response handler. All status codes are routed.
   *  @example
   *  api._onResponse({ "201": (data) => ..., "400": (data) => ... })
   */
  const _onResponse = (handlers: MatchHandlers<ResponseShape>) => {
    method.onSuccess((response) => matchStatus(response.data, handlers));
  };

  /** Register a success handler. Only 2xx statuses are routed.
   *  @example
   *  api._onSuccess({ "201": (data) => data.id })
   */
  const _onSuccess = (handlers: MatchHandlers<SuccessShape>) => {
    method.onSuccess((response) => matchSuccessStatus(response.data, handlers));
  };

  /** Register an error handler. Only 4xx / 5xx statuses are routed.
   *  @example
   *  api._onError({ "400": (data) => data.message })
   */
  const _onError = (handlers: MatchHandlers<FailShape>) => {
    method.onSuccess((response) => matchFailStatus(response.data, handlers));
  };

  // ── Return ────────────────────────────────────────────────────────────────

  return {
    method,
    _data,
    matchStatus,
    matchSuccessStatus,
    matchFailStatus,
    _onResponse,
    _onSuccess,
    _onError,
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
