import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/WeatherForecast`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.array(
      z.object({
        date: z.string(),
        temperatureC: z.number().int(),
        temperatureF: z.number().int(),
        summary: z.string().nullable(),
      })
    ),
  },
});
export default { config };
