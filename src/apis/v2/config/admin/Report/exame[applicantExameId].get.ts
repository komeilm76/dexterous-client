import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Report/exame`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({
      applicantExameId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
    }),
    query: z.object({}),
  },
  response: {
    data: z.object({
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      nationalCode: z.string().nullable(),
      phoneNumber: z.string().nullable(),
      participateDateTime: z.string().nullable(),
      exameTitle: z.string().nullable(),
      ageRange: z.string().nullable(),
      items: z
        .array(
          z.object({
            questionSection: z.string().nullable(),
            score: z.number().int(),
            description: z.string().nullable(),
          })
        )
        .nullable(),
    }),
  },
});
export default { config };
