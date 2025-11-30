import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Faq/delete`,
  method: "delete",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.object({}),
    params: z.object({
      id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
    }),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
