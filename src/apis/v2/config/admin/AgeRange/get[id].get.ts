import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/AgeRange/get`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({
      id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
    }),
    query: z.object({}),
  },
  response: {
    data: z.object({
      id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      title: z.string().nullable(),
      from: z.number().int(),
      to: z.number().int(),
    }),
  },
});
export default { config };
