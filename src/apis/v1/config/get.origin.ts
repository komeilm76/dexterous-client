import { kmApi } from "km-api";
import { z } from "zod";

const schema = z.object({
  name: z.string(),
});

const config = kmApi.v4.makeApiConfig({
  pathShape: `/origin`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({
      id: z.string(),
    }),
    cookies: z.object({
      sessionId: z.string(),
    }),
    headers: z.object({
      "x-api-key": z.string(),
    }),
    query: z.object({
      page: z.number().int().optional(),
      pageSize: z.number().int().optional(),
      searchTerm: z.string().optional(),
    }),
  },
  response: {
    success: z.array(
      z.object({
        date: z.string(),
        temperatureC: z.number().int(),
        temperatureF: z.number().int(),
        summary: z.string().nullable(),
      }),
    ),
    error: z.object({}),
  },
  // requestContentType: "application/json",
  // responseContentType: "application/json",
});
export default { config };
