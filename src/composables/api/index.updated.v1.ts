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

// ─── Handler types ────────────────────────────────────────────────────────────

/**
 * Exact per-status handlers.
 * Callback receives the narrowly-typed `data` for that exact status code.
 */
type ExactHandlers<SHAPE extends { status: PropertyKey; data: unknown }> = {
  [K in SHAPE["status"]]?: (
    data: Extract<SHAPE, { status: K }>["data"],
  ) => void;
};

/**
 * Wildcard handlers for _onSuccess — covers 2xx and 3xx groups.
 *
 * Priority (highest → lowest):
 *   exact code  >  "2**" / "3**"  >  "(2,3)**"
 */
type SuccessMatchHandlers<
  SHAPE extends { status: PropertyKey; data: unknown },
> = ExactHandlers<SHAPE> & {
  /** Catch-all for unhandled 2xx responses not matched by an exact code. */
  "2**"?: (response: Extract<SHAPE, { status: `2${string}` }>) => void;
  /** Catch-all for unhandled 3xx responses not matched by an exact code. */
  "3**"?: (response: Extract<SHAPE, { status: `3${string}` }>) => void;
  /** Catch-all for any 2xx or 3xx response not matched by "2**" or "3**". */
  "(2,3)**"?: (
    response: Extract<SHAPE, { status: `2${string}` | `3${string}` }>,
  ) => void;
};

/**
 * Wildcard handlers for _onError — covers 4xx and 5xx groups.
 *
 * Priority (highest → lowest):
 *   exact code  >  "4**" / "5**"  >  "(4,5)**"
 */
type FailMatchHandlers<SHAPE extends { status: PropertyKey; data: unknown }> =
  ExactHandlers<SHAPE> & {
    /** Catch-all for unhandled 4xx responses not matched by an exact code. */
    "4**"?: (response: Extract<SHAPE, { status: `4${string}` }>) => void;
    /** Catch-all for unhandled 5xx responses not matched by an exact code. */
    "5**"?: (response: Extract<SHAPE, { status: `5${string}` }>) => void;
    /** Catch-all for any 4xx or 5xx response not matched by "4**" or "5**". */
    "(4,5)**"?: (
      response: Extract<SHAPE, { status: `4${string}` | `5${string}` }>,
    ) => void;
  };

/**
 * Wildcard handlers for _onResponse — covers all groups plus universal.
 *
 * Priority (highest → lowest):
 *   exact code  >  "2**" / "3**" / "4**" / "5**"  >  "(2,3)**" / "(4,5)**"  >  "***"
 */
type AllMatchHandlers<SHAPE extends { status: PropertyKey; data: unknown }> =
  ExactHandlers<SHAPE> & {
    "2**"?: (response: Extract<SHAPE, { status: `2${string}` }>) => void;
    "3**"?: (response: Extract<SHAPE, { status: `3${string}` }>) => void;
    "(2,3)**"?: (
      response: Extract<SHAPE, { status: `2${string}` | `3${string}` }>,
    ) => void;
    "4**"?: (response: Extract<SHAPE, { status: `4${string}` }>) => void;
    "5**"?: (response: Extract<SHAPE, { status: `5${string}` }>) => void;
    "(4,5)**"?: (
      response: Extract<SHAPE, { status: `4${string}` | `5${string}` }>,
    ) => void;
    /** Last-resort catch-all for any status not matched by any other handler. */
    "***"?: (response: SHAPE) => void;
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

  // 2xx / 3xx statuses — success / redirect responses
  type SuccessShape = Extract<
    ResponseShape,
    { status: `2${string}` | `3${string}` }
  >;

  // 4xx / 5xx statuses — error responses
  type FailShape = Extract<
    ResponseShape,
    { status: `4${string}` | `5${string}` }
  >;

  // ── Type predicates ───────────────────────────────────────────────────────

  const isSuccessStatus = (data: ResponseShape): data is SuccessShape => {
    const first = String(data.status)[0];
    return first === "2" || first === "3";
  };

  const isFailStatus = (data: ResponseShape): data is FailShape => {
    const first = String(data.status)[0];
    return first === "4" || first === "5";
  };

  // ── Dispatch (priority-aware runtime core) ────────────────────────────────

  /**
   * Fires exactly ONE handler — the highest-priority match for the response status.
   *
   * Resolution order:
   *   P1  exact code      "200", "201", "400", …   → receives typed data
   *   P2  group wildcard  "2**", "3**", "4**", "5**"   → receives full response
   *   P3  multi-group     "(2,3)**", "(4,5)**"          → receives full response
   *   P4  universal       "***"                         → receives full response
   */
  const _dispatch = (
    response: ResponseShape,
    handlers: AllMatchHandlers<ResponseShape>,
  ) => {
    const firstDigit = String(response.status)[0];

    // P1 — exact status
    const exact = (handlers as ExactHandlers<ResponseShape>)[
      response.status as ResponseShape["status"]
    ];
    if (exact) {
      (exact as (data: unknown) => void)(response.data);
      return;
    }

    // P2 — specific group wildcard
    type AnyResponseFn = (r: ResponseShape) => void;
    let p2: AnyResponseFn | undefined;
    if (firstDigit === "2") p2 = handlers["2**"] as AnyResponseFn | undefined;
    else if (firstDigit === "3")
      p2 = handlers["3**"] as AnyResponseFn | undefined;
    else if (firstDigit === "4")
      p2 = handlers["4**"] as AnyResponseFn | undefined;
    else if (firstDigit === "5")
      p2 = handlers["5**"] as AnyResponseFn | undefined;
    if (p2) {
      p2(response);
      return;
    }

    // P3 — combined group wildcard
    let p3: AnyResponseFn | undefined;
    if (firstDigit === "2" || firstDigit === "3")
      p3 = handlers["(2,3)**"] as AnyResponseFn | undefined;
    else if (firstDigit === "4" || firstDigit === "5")
      p3 = handlers["(4,5)**"] as AnyResponseFn | undefined;
    if (p3) {
      p3(response);
      return;
    }

    // P4 — universal wildcard
    handlers["***"]?.(response);
  };

  // ── Match functions ───────────────────────────────────────────────────────

  /** Route any response to its highest-priority handler. All status codes eligible. */
  const matchStatus = (
    response: ResponseShape,
    handlers: AllMatchHandlers<ResponseShape>,
  ) => _dispatch(response, handlers);

  /** Route a response to its handler. Only 2xx / 3xx statuses pass through. */
  const matchSuccessStatus = (
    response: ResponseShape,
    handlers: SuccessMatchHandlers<SuccessShape>,
  ) => {
    if (isSuccessStatus(response))
      _dispatch(
        response,
        handlers as unknown as AllMatchHandlers<ResponseShape>,
      );
  };

  /** Route a response to its handler. Only 4xx / 5xx statuses pass through. */
  const matchFailStatus = (
    response: ResponseShape,
    handlers: FailMatchHandlers<FailShape>,
  ) => {
    if (isFailStatus(response))
      _dispatch(
        response,
        handlers as unknown as AllMatchHandlers<ResponseShape>,
      );
  };

  // ── Reactive snapshot ─────────────────────────────────────────────────────

  /**
   * Discriminated-union ref of the last response.
   * Narrow on `status` to get the correctly-typed `data`:
   * @example
   * if (api._data.value?.status === "201") { api._data.value.data.id }
   */
  const _data = ref<ResponseShape>();
  watch(method.data, (n) => {
    if (n != null) _data.value = n as ResponseShape;
  });

  // ── Short-path event handlers ─────────────────────────────────────────────

  /**
   * Register a handler for any response status.
   * Wildcards: "2**", "3**", "(2,3)**", "4**", "5**", "(4,5)**", "***"
   * @example
   * api._onResponse({
   *   "201": (data) => showCreated(data),       // P1 — exact
   *   "4**": (res) => toast.error(res.status),  // P2 — group
   *   "(2,3)**": (res) => onRedirect(res),      // P3 — multi-group
   *   "***": (res) => log(res.status),          // P4 — universal
   * })
   */
  const _onResponse = (handlers: AllMatchHandlers<ResponseShape>) => {
    method.onSuccess((response) => matchStatus(response.data, handlers));
  };

  /**
   * Register a handler for 2xx / 3xx responses only.
   * Wildcards: "2**", "3**", "(2,3)**"
   * @example
   * api._onSuccess({
   *   "201": (data) => flow1(data),       // P1 — exact
   *   "2**": (res) => flow2(res.data),    // P2 — group
   *   "(2,3)**": (res) => fallback(res),  // P3 — multi-group
   * })
   */
  const _onSuccess = (handlers: SuccessMatchHandlers<SuccessShape>) => {
    method.onSuccess((response) => matchSuccessStatus(response.data, handlers));
  };

  /**
   * Register a handler for 4xx / 5xx responses only.
   * Wildcards: "4**", "5**", "(4,5)**"
   * @example
   * api._onError({
   *   "400": (data) => toast.error(data.message),   // P1 — exact
   *   "401": () => appJwt.logout(),                 // P1 — exact
   *   "5**": (res) => toast.error("Server error"),  // P2 — group
   *   "(4,5)**": (res) => log(res.status),          // P3 — multi-group
   * })
   */
  const _onError = (handlers: FailMatchHandlers<FailShape>) => {
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
