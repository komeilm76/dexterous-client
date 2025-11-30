import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/applicant/Exame/taken/detail`,
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
      title: z.string().nullable(),
      description: z.string().nullable(),
      code: z.string().nullable(),
      participateDateTime: z.string().nullable(),
      responses: z
        .array(
          z.object({
            questionTitle: z.string().nullable(),
            answerTitle: z.string().nullable(),
            score: z.number().transform((v) => {
              /* v is float number */ return v;
            }),
          })
        )
        .nullable(),
    }),
  },
});
export default { config };
