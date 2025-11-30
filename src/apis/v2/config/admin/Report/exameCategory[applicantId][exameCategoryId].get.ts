import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Report/exameCategory`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({
      exameCategoryId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      applicantId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
    }),
    query: z.object({}),
  },
  response: {
    data: z.object({
      reportItems: z
        .array(
          z.object({
            questionSection: z.string().nullable(),
            report: z
              .array(
                z.object({
                  age: z.number().int(),
                  score: z.number().int(),
                  description: z.string().nullable(),
                })
              )
              .nullable(),
          })
        )
        .nullable(),
    }),
  },
});
export default { config };
