import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Faq/update`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.object({
      id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      question: z.string().nullable(),
      answer: z.string().nullable(),
      rowOrder: z.number().int(),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
