import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/pub/Home/exame/most`,
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
    ),
  },
});
export default { config };
