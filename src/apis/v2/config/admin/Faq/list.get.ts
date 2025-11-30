import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Faq/list`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({
      items: z
        .array(
          z.object({
            id: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
            question: z.string().nullable(),
            answer: z.string().nullable(),
            rowOrder: z.number().int(),
          })
        )
        .nullable(),
      page: z.number().int(),
      pageSize: z.number().int(),
      totalPages: z.number().int(),
      totalCounts: z.number().int(),
      hasMore: z.boolean(),
    }),
  },
});
export default { config };
