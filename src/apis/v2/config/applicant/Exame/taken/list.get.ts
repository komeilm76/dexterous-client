import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/applicant/Exame/taken/list`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({}),
    query: z.object({
      Code: z.string().optional(),
      page: z.number().int().optional(),
      pageSize: z.number().int().optional(),
    }),
  },
  response: {
    data: z.object({
      items: z
        .array(
          z.object({
            id: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
            exameId: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
            title: z.string().nullable(),
            description: z.string().nullable(),
            code: z.string().nullable(),
            participateDateTime: z.string().nullable(),
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
