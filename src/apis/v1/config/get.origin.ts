import kmApi from "km-api";
import { z } from "zod/v4";

const config = kmApi.makeApiConfig({
  path: `/origin`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({}),
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
