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
    params: z.object({}),
    cookies: z.object({}),
    headers: z.object({}),
    query: z.object({}),
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
});
export default { config };
