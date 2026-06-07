import { describe, it, expect, vi, expectTypeOf, beforeEach } from "vitest";
import { z } from "zod";
import { nextTick } from "vue";
import { makeApiConfig } from "km-api";

// ─── Mock infrastructure ──────────────────────────────────────────────────────

/**
 * `currentMethod` is reassigned every time `useApi` is called (because
 * `useRequest` runs once per `useApi` call). Tests always operate on the
 * instance that was created by the most recent `useApi(...)` call.
 */
let currentMethod: {
  onError: ReturnType<typeof vi.fn>;
  onSuccess: ReturnType<typeof vi.fn>;
  send: ReturnType<typeof vi.fn>;
  uploading: { value: { loaded: number; total: number } };
  data: { value: any };
  error: { value: any };
  loading: { value: boolean };
};

vi.mock("../../http", async () => {
  const { ref } = await import("vue");
  return {
    useHttp: () => ({
      hook: {
        useRequest: () => {
          currentMethod = {
            onError: vi.fn(),
            onSuccess: vi.fn(),
            send: vi.fn(),
            uploading: ref({ loaded: 0, total: 0 }),
            data: ref(null),
            error: ref(null),
            loading: ref(false),
          };
          return currentMethod;
        },
      },
      http: { Request: vi.fn() },
    }),
  };
});

vi.mock("@/stores/application/toast", () => ({
  useAppToast: () => ({ service: { error: vi.fn() } }),
}));

const mockLogout = vi.fn();
vi.mock("@/stores/application/jwt", () => ({
  useAppJwt: () => ({ logout: mockLogout }),
}));

const mockRouterPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockRouterPush }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── Test config ──────────────────────────────────────────────────────────────
//
//  2xx : "200" → { id, updated }   "201" → { id, name }
//  3xx : "301" → { redirectUrl }
//  4xx : "400" → { message, code } "401" → { error }
//  5xx : "500" → { serverError }

const testConfig = makeApiConfig({
  method: "POST" as const,
  pathShape: "/test/:id",
  auth: "YES" as const,
  requestContentType: "application/json" as const,
  responseContentType: "application/json" as const,
  summary: "Test endpoint",
  tags: [],
  request: {
    body: z.object({ name: z.string() }),
    params: z.object({ id: z.string() }),
    query: z.object({ page: z.number().optional() }),
    headers: z.object({ Authorization: z.string().optional() }),
    cookies: z.object({}),
  },
  response: {
    "200": z.object({ id: z.string(), updated: z.boolean() }),
    "201": z.object({ id: z.string(), name: z.string() }),
    "301": z.object({ redirectUrl: z.string() }),
    "400": z.object({ message: z.string(), code: z.number() }),
    "401": z.object({ error: z.string() }),
    "500": z.object({ serverError: z.string() }),
  },
});

import { useApi } from "../index.updated.v1";

// ─── Helpers ──────────────────────────────────────────────────────────────────

type AnyResponse = { status: string; data: unknown; statusText: string };

/**
 * Simulates alova firing the success event for the current `useApi` instance.
 * Calls every callback registered via `method.onSuccess(cb)`.
 */
const triggerSuccess = (response: AnyResponse) => {
  vi.mocked(currentMethod.onSuccess).mock.calls.forEach((args) =>
    (args[0] as Function)({ data: response }),
  );
};

/**
 * Simulates alova firing the error event.
 * Calls every callback registered via `method.onError(cb)`.
 */
const triggerError = (error: {
  code?: string;
  status?: number;
  message?: string;
}) => {
  vi.mocked(currentMethod.onError).mock.calls.forEach((args) =>
    (args[0] as Function)({ error }),
  );
};

// Pre-built response fixtures
const res200 = {
  status: "200",
  data: { id: "u1", updated: true },
  statusText: "OK",
} as const;

const res201 = {
  status: "201",
  data: { id: "u2", name: "Alice" },
  statusText: "Created",
} as const;

const res301 = {
  status: "301",
  data: { redirectUrl: "/new-path" },
  statusText: "Moved Permanently",
} as const;

const res400 = {
  status: "400",
  data: { message: "Bad request", code: 400 },
  statusText: "Bad Request",
} as const;

const res401 = {
  status: "401",
  data: { error: "Unauthorized" },
  statusText: "Unauthorized",
} as const;

const res500 = {
  status: "500",
  data: { serverError: "Internal error" },
  statusText: "Internal Server Error",
} as const;

// ─── 1. Return surface ────────────────────────────────────────────────────────

describe("useApi — returned surface", () => {
  it("returns all expected keys", () => {
    const api = useApi(testConfig, () => {});
    expect(api).toHaveProperty("method");
    expect(api).toHaveProperty("_data");
    expect(api).toHaveProperty("matchStatus");
    expect(api).toHaveProperty("matchSuccessStatus");
    expect(api).toHaveProperty("matchFailStatus");
    expect(api).toHaveProperty("_onResponse");
    expect(api).toHaveProperty("_onSuccess");
    expect(api).toHaveProperty("_onError");
    expect(api).toHaveProperty("config");
    expect(api).toHaveProperty("reloadWithLastOptions");
    expect(api).toHaveProperty("reloadWithFirstOptions");
    expect(api).toHaveProperty("getRequestLastOptions");
    expect(api).toHaveProperty("uploadData");
    expect(api.uploadData).toHaveProperty("info");
    expect(api.uploadData).toHaveProperty("status");
    expect(api).toHaveProperty("error");
    expect(api).toHaveProperty("errorMessage");
  });

  it("all match/handler helpers are functions", () => {
    const api = useApi(testConfig, () => {});
    expect(typeof api.matchStatus).toBe("function");
    expect(typeof api.matchSuccessStatus).toBe("function");
    expect(typeof api.matchFailStatus).toBe("function");
    expect(typeof api._onResponse).toBe("function");
    expect(typeof api._onSuccess).toBe("function");
    expect(typeof api._onError).toBe("function");
  });

  it("reload helpers are functions", () => {
    const api = useApi(testConfig, () => {});
    expect(typeof api.reloadWithLastOptions).toBe("function");
    expect(typeof api.reloadWithFirstOptions).toBe("function");
    expect(typeof api.getRequestLastOptions).toBe("function");
  });
});

// ─── 2. config ────────────────────────────────────────────────────────────────

describe("config", () => {
  it("is the exact same reference passed in", () => {
    const api = useApi(testConfig, () => {});
    expect(api.config).toBe(testConfig);
  });
});

// ─── 3. method ───────────────────────────────────────────────────────────────

describe("method", () => {
  it("exposes send, onSuccess, onError from alova", () => {
    const api = useApi(testConfig, () => {});
    expect(typeof api.method.send).toBe("function");
    expect(typeof api.method.onSuccess).toBe("function");
    expect(typeof api.method.onError).toBe("function");
  });

  it("registers the built-in onError handler at construction", () => {
    useApi(testConfig, () => {});
    expect(currentMethod.onError).toHaveBeenCalledOnce();
  });

  it("built-in onError does not throw on ERR_NETWORK", () => {
    useApi(testConfig, () => {});
    expect(() =>
      triggerError({ code: "ERR_NETWORK", message: "Network Error" }),
    ).not.toThrow();
  });

  it("built-in onError calls logout on 401", () => {
    useApi(testConfig, () => {});
    triggerError({ status: 401 });
    expect(mockLogout).toHaveBeenCalledOnce();
  });

  it("built-in onError does not call logout for non-401 errors", () => {
    useApi(testConfig, () => {});
    triggerError({ status: 403 });
    expect(mockLogout).not.toHaveBeenCalled();
  });
});

// ─── 4. getRequestLastOptions ─────────────────────────────────────────────────

describe("getRequestLastOptions", () => {
  it("returns an object immediately after construction", () => {
    const api = useApi(testConfig, () => {});
    expect(typeof api.getRequestLastOptions()).toBe("object");
  });

  it("initial value is an empty options object", () => {
    const api = useApi(testConfig, () => {});
    expect(api.getRequestLastOptions()).toEqual({});
  });
});

// ─── 5. reloadWithLastOptions ─────────────────────────────────────────────────

describe("reloadWithLastOptions", () => {
  it("calls method.send once", () => {
    const api = useApi(testConfig, () => {});
    api.reloadWithLastOptions();
    expect(api.method.send).toHaveBeenCalledOnce();
  });

  it("passes loadFromCache: true when flag is true", () => {
    const api = useApi(testConfig, () => {});
    api.reloadWithLastOptions(true);
    expect(api.method.send).toHaveBeenCalledWith(
      expect.objectContaining({ loadFromCache: true }),
    );
  });

  it("passes loadFromCache: false when flag is false", () => {
    const api = useApi(testConfig, () => {});
    api.reloadWithLastOptions(false);
    expect(api.method.send).toHaveBeenCalledWith(
      expect.objectContaining({ loadFromCache: false }),
    );
  });

  it("passes loadFromCache: undefined when flag is omitted", () => {
    const api = useApi(testConfig, () => {});
    api.reloadWithLastOptions();
    expect(api.method.send).toHaveBeenCalledWith(
      expect.objectContaining({ loadFromCache: undefined }),
    );
  });
});

// ─── 6. reloadWithFirstOptions ───────────────────────────────────────────────

describe("reloadWithFirstOptions", () => {
  it("does NOT call send before the first request (firstOptions is undefined)", () => {
    const api = useApi(testConfig, () => {});
    api.reloadWithFirstOptions();
    expect(api.method.send).not.toHaveBeenCalled();
  });

  it("accepts a loadFromCache flag (no-op guard when firstOptions is unset)", () => {
    const api = useApi(testConfig, () => {});
    expect(() => api.reloadWithFirstOptions(true)).not.toThrow();
  });
});

// ─── 7. _data reactive ref ────────────────────────────────────────────────────

describe("_data", () => {
  it("is undefined before any response arrives", () => {
    const api = useApi(testConfig, () => {});
    expect(api._data.value).toBeUndefined();
  });

  it("updates when method.data changes to a 2xx response", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.data.value = res200;
    await nextTick();
    expect(api._data.value).toEqual(res200);
  });

  it("updates when method.data changes to a 4xx response", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.data.value = res400;
    await nextTick();
    expect(api._data.value).toEqual(res400);
  });

  it("does not update when method.data is set to null", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.data.value = res200;
    await nextTick();
    currentMethod.data.value = null;
    await nextTick();
    expect(api._data.value).toEqual(res200); // retains last non-null
  });

  it("narrows data type after status check", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.data.value = res201;
    await nextTick();
    if (api._data.value?.status === "201") {
      expectTypeOf(api._data.value.data).toEqualTypeOf<{
        id: string;
        name: string;
      }>();
    }
  });
});

// ─── 8. error + errorMessage ──────────────────────────────────────────────────

describe("error", () => {
  it("is null initially", () => {
    const api = useApi(testConfig, () => {});
    expect(api.error.value).toBeNull();
  });

  it("reflects method.error when set", async () => {
    const api = useApi(testConfig, () => {});
    const axiosErr = { message: "Not found", isAxiosError: true };
    currentMethod.error.value = axiosErr;
    await nextTick();
    expect(api.error.value).toStrictEqual(axiosErr);
  });
});

describe("errorMessage", () => {
  it("is undefined when there is no error", () => {
    const api = useApi(testConfig, () => {});
    expect(api.errorMessage.value).toBeUndefined();
  });

  it("returns the error message string when an error exists", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.error.value = { message: "Something broke", isAxiosError: true };
    await nextTick();
    expect(api.errorMessage.value).toBe("Something broke");
  });

  it("is undefined when error has no message property", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.error.value = { code: "ERR_NETWORK" };
    await nextTick();
    expect(api.errorMessage.value).toBeUndefined();
  });
});

// ─── 9. uploadData.info ───────────────────────────────────────────────────────

describe("uploadData.info", () => {
  it("starts at 0 loaded, 0 total, 0 percent, not uploading", () => {
    const api = useApi(testConfig, () => {});
    const info = api.uploadData.info.value;
    expect(info.loadedSize).toBe(0);
    expect(info.totalSize).toBe(0);
    expect(info.loadedPercent).toBe(0);
    expect(info.uploading).toBe(false);
  });

  it("reports uploading=true while loaded < total", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.uploading.value = { loaded: 40, total: 100 };
    await nextTick();
    expect(api.uploadData.info.value.uploading).toBe(true);
  });

  it("computes correct percent during upload", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.uploading.value = { loaded: 75, total: 100 };
    await nextTick();
    expect(api.uploadData.info.value.loadedPercent).toBe(75);
  });

  it("reports uploading=false when loaded === total (non-zero)", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.uploading.value = { loaded: 100, total: 100 };
    await nextTick();
    expect(api.uploadData.info.value.uploading).toBe(false);
    expect(api.uploadData.info.value.loadedPercent).toBe(100);
  });

  it("rounds percent to 2 decimal places", async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.uploading.value = { loaded: 1, total: 3 };
    await nextTick();
    expect(api.uploadData.info.value.loadedPercent).toBe(33.33);
  });
});

// ─── 10. uploadData.status ────────────────────────────────────────────────────

describe("uploadData.status", () => {
  it('starts as "NO"', () => {
    const api = useApi(testConfig, () => {});
    expect(api.uploadData.status.value).toBe("NO");
  });

  it('transitions to "UPLOADING" while loaded < total', async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.uploading.value = { loaded: 30, total: 100 };
    await nextTick();
    expect(api.uploadData.status.value).toBe("UPLOADING");
  });

  it('transitions to "YES" when loaded reaches total', async () => {
    const api = useApi(testConfig, () => {});
    currentMethod.uploading.value = { loaded: 100, total: 100 };
    await nextTick();
    expect(api.uploadData.status.value).toBe("YES");
  });

  it('transitions to "YES_AFTER_MOMENT" 3s after upload completes', async () => {
    vi.useFakeTimers();
    const api = useApi(testConfig, () => {});
    currentMethod.uploading.value = { loaded: 100, total: 100 };
    await nextTick();
    expect(api.uploadData.status.value).toBe("YES");
    vi.advanceTimersByTime(3000);
    expect(api.uploadData.status.value).toBe("YES_AFTER_MOMENT");
    vi.useRealTimers();
  });
});

// ─── 11. _dispatch priority (tested via matchStatus) ─────────────────────────

describe("_dispatch priority — only the highest-priority handler fires", () => {
  it("P1 wins over P2, P3, P4 (exact code beats all wildcards)", () => {
    const api = useApi(testConfig, () => {});
    const p1 = vi.fn(), p2 = vi.fn(), p3 = vi.fn(), p4 = vi.fn();

    api.matchStatus(res200, { "200": p1, "2**": p2, "(2,3)**": p3, "***": p4 });

    expect(p1).toHaveBeenCalledOnce();
    expect(p2).not.toHaveBeenCalled();
    expect(p3).not.toHaveBeenCalled();
    expect(p4).not.toHaveBeenCalled();
  });

  it("P1 exact data payload is the typed data, not the full response", () => {
    const api = useApi(testConfig, () => {});
    let received: unknown;
    api.matchStatus(res200, { "200": (data) => { received = data; } });
    expect(received).toEqual({ id: "u1", updated: true });
  });

  it("P2 (2**) wins over P3 (2,3)** and P4 *** when no exact code matches", () => {
    const api = useApi(testConfig, () => {});
    const p2 = vi.fn(), p3 = vi.fn(), p4 = vi.fn();

    api.matchStatus(res200, { "2**": p2, "(2,3)**": p3, "***": p4 });

    expect(p2).toHaveBeenCalledOnce();
    expect(p3).not.toHaveBeenCalled();
    expect(p4).not.toHaveBeenCalled();
  });

  it("P2 (3**) wins over (2,3)** and ***", () => {
    const api = useApi(testConfig, () => {});
    const p2 = vi.fn(), p3 = vi.fn(), p4 = vi.fn();

    api.matchStatus(res301, { "3**": p2, "(2,3)**": p3, "***": p4 });

    expect(p2).toHaveBeenCalledOnce();
    expect(p3).not.toHaveBeenCalled();
    expect(p4).not.toHaveBeenCalled();
  });

  it("P2 (4**) wins over (4,5)** and ***", () => {
    const api = useApi(testConfig, () => {});
    const p2 = vi.fn(), p3 = vi.fn(), p4 = vi.fn();

    api.matchStatus(res400, { "4**": p2, "(4,5)**": p3, "***": p4 });

    expect(p2).toHaveBeenCalledOnce();
    expect(p3).not.toHaveBeenCalled();
    expect(p4).not.toHaveBeenCalled();
  });

  it("P2 (5**) wins over (4,5)** and ***", () => {
    const api = useApi(testConfig, () => {});
    const p2 = vi.fn(), p3 = vi.fn(), p4 = vi.fn();

    api.matchStatus(res500, { "5**": p2, "(4,5)**": p3, "***": p4 });

    expect(p2).toHaveBeenCalledOnce();
    expect(p3).not.toHaveBeenCalled();
    expect(p4).not.toHaveBeenCalled();
  });

  it("P3 (2,3)** wins over *** when no exact or 2**/3** handler", () => {
    const api = useApi(testConfig, () => {});
    const p3 = vi.fn(), p4 = vi.fn();

    api.matchStatus(res200, { "(2,3)**": p3, "***": p4 });

    expect(p3).toHaveBeenCalledOnce();
    expect(p4).not.toHaveBeenCalled();
  });

  it("P3 (4,5)** wins over *** when no exact or 4**/5** handler", () => {
    const api = useApi(testConfig, () => {});
    const p3 = vi.fn(), p4 = vi.fn();

    api.matchStatus(res400, { "(4,5)**": p3, "***": p4 });

    expect(p3).toHaveBeenCalledOnce();
    expect(p4).not.toHaveBeenCalled();
  });

  it("P4 *** fires when no other handler matches", () => {
    const api = useApi(testConfig, () => {});
    const p4 = vi.fn();

    api.matchStatus(res200, { "***": p4 });

    expect(p4).toHaveBeenCalledOnce();
  });

  it("nothing fires when handlers object is empty", () => {
    const api = useApi(testConfig, () => {});
    expect(() => api.matchStatus(res200, {})).not.toThrow();
  });

  it("P1 exact for 4xx also beats (4,5)** and ***", () => {
    const api = useApi(testConfig, () => {});
    const p1 = vi.fn(), p3 = vi.fn(), p4 = vi.fn();

    api.matchStatus(res401, { "401": p1, "(4,5)**": p3, "***": p4 });

    expect(p1).toHaveBeenCalledOnce();
    expect(p3).not.toHaveBeenCalled();
    expect(p4).not.toHaveBeenCalled();
  });

  it("wildcard handlers receive the full response object (status + data + statusText)", () => {
    const api = useApi(testConfig, () => {});
    let received: unknown;

    api.matchStatus(res200, { "2**": (res) => { received = res; } });

    expect(received).toEqual(res200);
  });
});

// ─── 12. matchStatus ─────────────────────────────────────────────────────────

describe("matchStatus — routing", () => {
  it("routes a 2xx response to its exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchStatus(res201, { "201": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes a 4xx response to its exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchStatus(res400, { "400": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes a 5xx response to its exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchStatus(res500, { "500": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it("does not call the wrong handler", () => {
    const api = useApi(testConfig, () => {});
    const h400 = vi.fn();
    api.matchStatus(res201, { "400": h400 });
    expect(h400).not.toHaveBeenCalled();
  });
});

describe("matchStatus — type narrowing", () => {
  it('narrows data to "200" schema in exact handler', () => {
    const api = useApi(testConfig, () => {});
    api.matchStatus(res200, {
      "200": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ id: string; updated: boolean }>();
      },
    });
  });

  it('narrows data to "201" schema in exact handler', () => {
    const api = useApi(testConfig, () => {});
    api.matchStatus(res201, {
      "201": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ id: string; name: string }>();
      },
    });
  });

  it('narrows data to "400" schema in exact handler', () => {
    const api = useApi(testConfig, () => {});
    api.matchStatus(res400, {
      "400": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ message: string; code: number }>();
      },
    });
  });

  it('narrows data to "401" schema in exact handler', () => {
    const api = useApi(testConfig, () => {});
    api.matchStatus(res401, {
      "401": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ error: string }>();
      },
    });
  });

  it('"***" handler receives the full discriminated-union response', () => {
    const api = useApi(testConfig, () => {});
    api.matchStatus(res200, {
      "***": (res) => {
        expectTypeOf(res.status).toEqualTypeOf<
          "200" | "201" | "301" | "400" | "401" | "500"
        >();
      },
    });
  });
});

// ─── 13. matchSuccessStatus ───────────────────────────────────────────────────

describe("matchSuccessStatus — routing", () => {
  it("routes a 2xx response to the handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchSuccessStatus(res200, { "200": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes a 3xx response to the handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchSuccessStatus(res301, { "301": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it("blocks a 4xx response — handler is NOT called", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchSuccessStatus(res400, { "400": h } as any);
    expect(h).not.toHaveBeenCalled();
  });

  it("blocks a 5xx response — handler is NOT called", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchSuccessStatus(res500, { "500": h } as any);
    expect(h).not.toHaveBeenCalled();
  });

  it('"2**" catches any 2xx not matched by exact code', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchSuccessStatus(res200, { "2**": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it('"3**" catches any 3xx not matched by exact code', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchSuccessStatus(res301, { "3**": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it('"(2,3)**" catches a 2xx when no exact or 2** handler', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchSuccessStatus(res200, { "(2,3)**": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it('"(2,3)**" catches a 3xx when no exact or 3** handler', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchSuccessStatus(res301, { "(2,3)**": h });
    expect(h).toHaveBeenCalledOnce();
  });
});

describe("matchSuccessStatus — type narrowing", () => {
  it('"200" exact handler receives { id, updated }', () => {
    const api = useApi(testConfig, () => {});
    api.matchSuccessStatus(res200, {
      "200": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ id: string; updated: boolean }>();
      },
    });
  });

  it('"(2,3)**" handler receives 2xx|3xx response union', () => {
    const api = useApi(testConfig, () => {});
    api.matchSuccessStatus(res200, {
      "(2,3)**": (res) => {
        expectTypeOf(res.status).toEqualTypeOf<"200" | "201" | "301">();
      },
    });
  });
});

// ─── 14. matchFailStatus ──────────────────────────────────────────────────────

describe("matchFailStatus — routing", () => {
  it("routes a 4xx response to the handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchFailStatus(res400, { "400": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes a 5xx response to the handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchFailStatus(res500, { "500": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it("blocks a 2xx response — handler is NOT called", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchFailStatus(res200, { "200": h } as any);
    expect(h).not.toHaveBeenCalled();
  });

  it("blocks a 3xx response — handler is NOT called", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchFailStatus(res301, { "301": h } as any);
    expect(h).not.toHaveBeenCalled();
  });

  it('"4**" catches any 4xx not matched by exact code', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchFailStatus(res401, { "4**": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it('"5**" catches any 5xx not matched by exact code', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchFailStatus(res500, { "5**": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it('"(4,5)**" catches a 4xx when no exact or 4** handler', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchFailStatus(res400, { "(4,5)**": h });
    expect(h).toHaveBeenCalledOnce();
  });

  it('"(4,5)**" catches a 5xx when no exact or 5** handler', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api.matchFailStatus(res500, { "(4,5)**": h });
    expect(h).toHaveBeenCalledOnce();
  });
});

describe("matchFailStatus — type narrowing", () => {
  it('"400" exact handler receives { message, code }', () => {
    const api = useApi(testConfig, () => {});
    api.matchFailStatus(res400, {
      "400": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ message: string; code: number }>();
      },
    });
  });

  it('"(4,5)**" handler receives 4xx|5xx response union', () => {
    const api = useApi(testConfig, () => {});
    api.matchFailStatus(res400, {
      "(4,5)**": (res) => {
        expectTypeOf(res.status).toEqualTypeOf<"400" | "401" | "500">();
      },
    });
  });
});

// ─── 15. _onResponse ─────────────────────────────────────────────────────────

describe("_onResponse", () => {
  it("registers a callback via method.onSuccess", () => {
    const api = useApi(testConfig, () => {});
    api._onResponse({ "200": vi.fn() });
    expect(currentMethod.onSuccess).toHaveBeenCalledOnce();
  });

  it("routes a 2xx response to the exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onResponse({ "200": h });
    triggerSuccess(res200);
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes a 4xx response to the exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onResponse({ "400": h });
    triggerSuccess(res400);
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes to 4** when 400 has no exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h4xx = vi.fn();
    api._onResponse({ "4**": h4xx });
    triggerSuccess(res400);
    expect(h4xx).toHaveBeenCalledOnce();
  });

  it("routes to (4,5)** when no 4xx exact or 4** handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onResponse({ "(4,5)**": h });
    triggerSuccess(res401);
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes to *** as last resort", () => {
    const api = useApi(testConfig, () => {});
    const hAll = vi.fn();
    api._onResponse({ "***": hAll });
    triggerSuccess(res500);
    expect(hAll).toHaveBeenCalledOnce();
  });

  it("does NOT route to *** when a higher-priority handler matches", () => {
    const api = useApi(testConfig, () => {});
    const h200 = vi.fn(), hAll = vi.fn();
    api._onResponse({ "200": h200, "***": hAll });
    triggerSuccess(res200);
    expect(h200).toHaveBeenCalledOnce();
    expect(hAll).not.toHaveBeenCalled();
  });

  it("multiple _onResponse registrations each fire on response", () => {
    const api = useApi(testConfig, () => {});
    const h1 = vi.fn(), h2 = vi.fn();
    api._onResponse({ "200": h1 });
    api._onResponse({ "200": h2 });
    triggerSuccess(res200);
    expect(h1).toHaveBeenCalledOnce();
    expect(h2).toHaveBeenCalledOnce();
  });

  it("exact handler receives typed data, not the full response", () => {
    const api = useApi(testConfig, () => {});
    let received: unknown;
    api._onResponse({ "201": (data) => { received = data; } });
    triggerSuccess(res201);
    expect(received).toEqual({ id: "u2", name: "Alice" });
  });

  it("wildcard handler receives the full response object", () => {
    const api = useApi(testConfig, () => {});
    let received: unknown;
    api._onResponse({ "2**": (res) => { received = res; } });
    triggerSuccess(res200);
    expect(received).toEqual(res200);
  });
});

describe("_onResponse — type narrowing", () => {
  it('"201" exact handler is typed to { id, name }', () => {
    const api = useApi(testConfig, () => {});
    api._onResponse({
      "201": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ id: string; name: string }>();
      },
    });
  });

  it('"400" exact handler is typed to { message, code }', () => {
    const api = useApi(testConfig, () => {});
    api._onResponse({
      "400": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ message: string; code: number }>();
      },
    });
  });

  it('"***" handler receives the full discriminated union', () => {
    const api = useApi(testConfig, () => {});
    api._onResponse({
      "***": (res) => {
        expectTypeOf(res.status).toEqualTypeOf<
          "200" | "201" | "301" | "400" | "401" | "500"
        >();
      },
    });
  });
});

// ─── 16. _onSuccess ───────────────────────────────────────────────────────────

describe("_onSuccess", () => {
  it("registers a callback via method.onSuccess", () => {
    const api = useApi(testConfig, () => {});
    api._onSuccess({ "200": vi.fn() });
    expect(currentMethod.onSuccess).toHaveBeenCalledOnce();
  });

  it("routes a 2xx response to the exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onSuccess({ "200": h });
    triggerSuccess(res200);
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes a 3xx response to the exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onSuccess({ "301": h });
    triggerSuccess(res301);
    expect(h).toHaveBeenCalledOnce();
  });

  it("does NOT fire for a 4xx response", () => {
    const api = useApi(testConfig, () => {});
    const h4xx = vi.fn();
    api._onSuccess({ "400": h4xx } as any);
    triggerSuccess(res400);
    expect(h4xx).not.toHaveBeenCalled();
  });

  it("does NOT fire for a 5xx response", () => {
    const api = useApi(testConfig, () => {});
    const h5xx = vi.fn();
    api._onSuccess({ "500": h5xx } as any);
    triggerSuccess(res500);
    expect(h5xx).not.toHaveBeenCalled();
  });

  it('"2**" fires for a 2xx when no exact handler matches', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onSuccess({ "2**": h });
    triggerSuccess(res200);
    expect(h).toHaveBeenCalledOnce();
  });

  it('"3**" fires for a 3xx when no exact handler matches', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onSuccess({ "3**": h });
    triggerSuccess(res301);
    expect(h).toHaveBeenCalledOnce();
  });

  it('"(2,3)**" fires for 2xx when no exact or 2** handler', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onSuccess({ "(2,3)**": h });
    triggerSuccess(res201);
    expect(h).toHaveBeenCalledOnce();
  });

  it('"(2,3)**" fires for 3xx when no exact or 3** handler', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onSuccess({ "(2,3)**": h });
    triggerSuccess(res301);
    expect(h).toHaveBeenCalledOnce();
  });

  it("exact handler receives typed data payload", () => {
    const api = useApi(testConfig, () => {});
    let received: unknown;
    api._onSuccess({ "200": (data) => { received = data; } });
    triggerSuccess(res200);
    expect(received).toEqual({ id: "u1", updated: true });
  });

  it("P1 > P2: exact 201 beats 2** when both are registered", () => {
    const api = useApi(testConfig, () => {});
    const exact = vi.fn(), group = vi.fn();
    api._onSuccess({ "201": exact, "2**": group });
    triggerSuccess(res201);
    expect(exact).toHaveBeenCalledOnce();
    expect(group).not.toHaveBeenCalled();
  });

  it("P2 > P3: 2** beats (2,3)** when both are registered", () => {
    const api = useApi(testConfig, () => {});
    const group = vi.fn(), multi = vi.fn();
    api._onSuccess({ "2**": group, "(2,3)**": multi });
    triggerSuccess(res200);
    expect(group).toHaveBeenCalledOnce();
    expect(multi).not.toHaveBeenCalled();
  });
});

describe("_onSuccess — type narrowing", () => {
  it('"200" exact handler is typed to { id, updated }', () => {
    const api = useApi(testConfig, () => {});
    api._onSuccess({
      "200": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ id: string; updated: boolean }>();
      },
    });
  });

  it('"(2,3)**" handler status is typed to 2xx|3xx union', () => {
    const api = useApi(testConfig, () => {});
    api._onSuccess({
      "(2,3)**": (res) => {
        expectTypeOf(res.status).toEqualTypeOf<"200" | "201" | "301">();
      },
    });
  });
});

// ─── 17. _onError ─────────────────────────────────────────────────────────────

describe("_onError", () => {
  it("registers a callback via method.onSuccess", () => {
    const api = useApi(testConfig, () => {});
    api._onError({ "400": vi.fn() });
    expect(currentMethod.onSuccess).toHaveBeenCalledOnce();
  });

  it("routes a 4xx response to the exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onError({ "400": h });
    triggerSuccess(res400);
    expect(h).toHaveBeenCalledOnce();
  });

  it("routes a 5xx response to the exact handler", () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onError({ "500": h });
    triggerSuccess(res500);
    expect(h).toHaveBeenCalledOnce();
  });

  it("does NOT fire for a 2xx response", () => {
    const api = useApi(testConfig, () => {});
    const h2xx = vi.fn();
    api._onError({ "200": h2xx } as any);
    triggerSuccess(res200);
    expect(h2xx).not.toHaveBeenCalled();
  });

  it("does NOT fire for a 3xx response", () => {
    const api = useApi(testConfig, () => {});
    const h3xx = vi.fn();
    api._onError({ "301": h3xx } as any);
    triggerSuccess(res301);
    expect(h3xx).not.toHaveBeenCalled();
  });

  it('"4**" fires for any 4xx when no exact handler matches', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onError({ "4**": h });
    triggerSuccess(res401);
    expect(h).toHaveBeenCalledOnce();
  });

  it('"5**" fires for any 5xx when no exact handler matches', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onError({ "5**": h });
    triggerSuccess(res500);
    expect(h).toHaveBeenCalledOnce();
  });

  it('"(4,5)**" fires for 4xx when no exact or 4** handler', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onError({ "(4,5)**": h });
    triggerSuccess(res400);
    expect(h).toHaveBeenCalledOnce();
  });

  it('"(4,5)**" fires for 5xx when no exact or 5** handler', () => {
    const api = useApi(testConfig, () => {});
    const h = vi.fn();
    api._onError({ "(4,5)**": h });
    triggerSuccess(res500);
    expect(h).toHaveBeenCalledOnce();
  });

  it("exact handler receives typed data payload", () => {
    const api = useApi(testConfig, () => {});
    let received: unknown;
    api._onError({ "400": (data) => { received = data; } });
    triggerSuccess(res400);
    expect(received).toEqual({ message: "Bad request", code: 400 });
  });

  it("P1 > P2: exact 401 beats 4** when both are registered", () => {
    const api = useApi(testConfig, () => {});
    const exact = vi.fn(), group = vi.fn();
    api._onError({ "401": exact, "4**": group });
    triggerSuccess(res401);
    expect(exact).toHaveBeenCalledOnce();
    expect(group).not.toHaveBeenCalled();
  });

  it("P2 > P3: 4** beats (4,5)** when both are registered", () => {
    const api = useApi(testConfig, () => {});
    const group = vi.fn(), multi = vi.fn();
    api._onError({ "4**": group, "(4,5)**": multi });
    triggerSuccess(res400);
    expect(group).toHaveBeenCalledOnce();
    expect(multi).not.toHaveBeenCalled();
  });

  it("P1 > P3: exact 400 beats (4,5)** directly", () => {
    const api = useApi(testConfig, () => {});
    const exact = vi.fn(), multi = vi.fn();
    api._onError({ "400": exact, "(4,5)**": multi });
    triggerSuccess(res400);
    expect(exact).toHaveBeenCalledOnce();
    expect(multi).not.toHaveBeenCalled();
  });
});

describe("_onError — type narrowing", () => {
  it('"400" exact handler is typed to { message, code }', () => {
    const api = useApi(testConfig, () => {});
    api._onError({
      "400": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ message: string; code: number }>();
      },
    });
  });

  it('"401" exact handler is typed to { error }', () => {
    const api = useApi(testConfig, () => {});
    api._onError({
      "401": (data) => {
        expectTypeOf(data).toEqualTypeOf<{ error: string }>();
      },
    });
  });

  it('"(4,5)**" handler status is typed to 4xx|5xx union', () => {
    const api = useApi(testConfig, () => {});
    api._onError({
      "(4,5)**": (res) => {
        expectTypeOf(res.status).toEqualTypeOf<"400" | "401" | "500">();
      },
    });
  });

  it('"4**" handler status is typed to 4xx-only union', () => {
    const api = useApi(testConfig, () => {});
    api._onError({
      "4**": (res) => {
        expectTypeOf(res.status).toEqualTypeOf<"400" | "401">();
      },
    });
  });

  it('"5**" handler status is typed to 5xx-only union', () => {
    const api = useApi(testConfig, () => {});
    api._onError({
      "5**": (res) => {
        expectTypeOf(res.status).toEqualTypeOf<"500">();
      },
    });
  });
});
