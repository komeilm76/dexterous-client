import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/pub/Home/exame/list`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({}),
    query: z.object({
      page: z.number().int().optional(),
      pageSize: z.number().int().optional(),
      CategoryId: z
        .string()
        .transform((v) => {
          /* v is int64 */ return v;
        })
        .optional(),
      AgeRangeId: z
        .string()
        .transform((v) => {
          /* v is int64 */ return v;
        })
        .optional(),
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
            title: z.string().nullable(),
            description: z.string().nullable(),
            created: z.string().nullable(),
            code: z.string().nullable(),
            ageRange: z.object({
              id: z.string().transform((v) => {
                /* v is int64 */ return v;
              }),
              title: z.string().nullable(),
              from: z.number().int(),
              to: z.number().int(),
            }),
            category: z.object({
              id: z.string().transform((v) => {
                /* v is int64 */ return v;
              }),
              title: z.string().nullable(),
              description: z.string().nullable(),
            }),
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
