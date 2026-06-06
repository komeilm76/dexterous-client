import { describe, it, expect, vi, expectTypeOf } from "vitest";
import { z } from "zod";
import { makeApiConfig } from "km-api";

// ─── Mocks ────────────────────────────────────────────────────────────────────

vi.mock("../../http", async () => {
  const { ref } = await import("vue");
  return {
    useHttp: () => ({
      hook: {
        useRequest: () => ({
          onError: vi.fn(),
          onSuccess: vi.fn(),
          send: vi.fn(),
          uploading: ref({ loaded: 0, total: 0 }),
          data: ref(null),
          error: ref(null),
          loading: ref(false),
        }),
      },
      http: { Request: vi.fn() },
    }),
  };
});

vi.mock("@/stores/application/toast", () => ({
  useAppToast: () => ({ service: { value: { error: vi.fn() } } }),
}));

vi.mock("@/stores/application/jwt", () => ({
  useAppJwt: () => ({ logout: vi.fn(), token: "mock-token" }),
}));

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

// ─── Test config ──────────────────────────────────────────────────────────────

const testConfig = makeApiConfig({
  method: "POST" as const,
  pathShape: "/test",
  auth: "YES" as const,
  requestContentType: "application/json" as const,
  responseContentType: "application/json" as const,
  summary: "Test endpoint",
  tags: [],
  request: {
    body: z.object({ name: z.string() }),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({ Authorization: z.string() }),
    cookies: z.object({}),
  },
  response: {
    "201": z.object({ id: z.string(), name: z.string() }),
    "400": z.object({ message: z.string(), code: z.number() }),
  },
});

import { useApi } from "../";

// ─── matchStatus: runtime behaviour ───────────────────────────────────────────

describe("matchStatus — routing", () => {
  it("calls the handler matching the response status", () => {
    const api = useApi(testConfig, () => {});
    const handler = vi.fn();

    api.matchStatus(
      { status: "201", data: { id: "1", name: "post" }, statusText: "Created" },
      { "201": handler },
    );

    expect(handler).toHaveBeenCalledOnce();
  });

  it("passes the exact data to the matching handler", () => {
    const api = useApi(testConfig, () => {});
    let received: unknown;

    api.matchStatus(
      {
        status: "201",
        data: { id: "42", name: "hello" },
        statusText: "Created",
      },
      {
        "201": (data) => {
          received = data;
        },
      },
    );

    expect(received).toEqual({ id: "42", name: "hello" });
  });

  it("does not call handlers for non-matching statuses", () => {
    const api = useApi(testConfig, () => {});
    const handler201 = vi.fn();
    const handler400 = vi.fn();

    api.matchStatus(
      { status: "201", data: { id: "1", name: "post" }, statusText: "Created" },
      { "201": handler201, "400": handler400 },
    );

    expect(handler201).toHaveBeenCalledOnce();
    expect(handler400).not.toHaveBeenCalled();
  });

  it("does not throw when no handler is registered for the status", () => {
    const api = useApi(testConfig, () => {});

    expect(() =>
      api.matchStatus(
        {
          status: "400",
          data: { message: "bad", code: 400 },
          statusText: "Bad Request",
        },
        {},
      ),
    ).not.toThrow();
  });

  it("does not call any handler when none matches", () => {
    const api = useApi(testConfig, () => {});
    const handler400 = vi.fn();

    api.matchStatus(
      { status: "201", data: { id: "1", name: "post" }, statusText: "Created" },
      { "400": handler400 },
    );

    expect(handler400).not.toHaveBeenCalled();
  });
});

// ─── matchStatus: TypeScript type narrowing ───────────────────────────────────

describe("matchStatus — type narrowing", () => {
  it('narrows data to the "201" schema inside the "201" handler', () => {
    const api = useApi(testConfig, () => {});

    api.matchStatus(
      { status: "201", data: { id: "1", name: "post" }, statusText: "Created" },
      {
        "201": (data) => {
          expectTypeOf(data).toEqualTypeOf<{ id: string; name: string }>();
        },
      },
    );
  });

  it('narrows data to the "400" schema inside the "400" handler', () => {
    const api = useApi(testConfig, () => {});

    api.matchStatus(
      {
        status: "400",
        data: { message: "bad", code: 400 },
        statusText: "Bad Request",
      },
      {
        "400": (data) => {
          expectTypeOf(data).toEqualTypeOf<{ message: string; code: number }>();
        },
      },
    );
  });
});

// ─── API surface ──────────────────────────────────────────────────────────────

describe("useApi — returned API surface", () => {
  it("returns a method object with send, onSuccess, onError", () => {
    const api = useApi(testConfig, () => {});

    expect(api.method).toBeDefined();
    expect(typeof api.method.send).toBe("function");
    expect(typeof api.method.onSuccess).toBe("function");
    expect(typeof api.method.onError).toBe("function");
  });

  it("returns a matchStatus function", () => {
    const api = useApi(testConfig, () => {});
    expect(typeof api.matchStatus).toBe("function");
  });

  it("returns config equal to the input config", () => {
    const api = useApi(testConfig, () => {});
    expect(api.config).toBe(testConfig);
  });

  it("returns reloadWithLastOptions and reloadWithFirstOptions functions", () => {
    const api = useApi(testConfig, () => {});
    expect(typeof api.reloadWithLastOptions).toBe("function");
    expect(typeof api.reloadWithFirstOptions).toBe("function");
  });

  it("returns uploadData with info and status", () => {
    const api = useApi(testConfig, () => {});
    expect(api.uploadData).toBeDefined();
    expect(api.uploadData.info).toBeDefined();
    expect(api.uploadData.status).toBeDefined();
  });
});

// ─── reloadWith behaviour ─────────────────────────────────────────────────────

describe("useApi — reloadWith", () => {
  it("reloadWithLastOptions calls method.send once", () => {
    const api = useApi(testConfig, () => {});
    api.reloadWithLastOptions();
    expect(api.method.send).toHaveBeenCalledOnce();
  });

  it("reloadWithLastOptions accepts a loadFromCache flag", () => {
    const api = useApi(testConfig, () => {});
    api.reloadWithLastOptions(true);
    expect(api.method.send).toHaveBeenCalledWith(
      expect.objectContaining({ loadFromCache: true }),
    );
  });

  it("reloadWithFirstOptions does not call send before the first request", () => {
    const api = useApi(testConfig, () => {});
    api.reloadWithFirstOptions();
    expect(api.method.send).not.toHaveBeenCalled();
  });
});
