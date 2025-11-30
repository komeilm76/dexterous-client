import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/applicant/Exame/add`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.object({
      exameId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      reponses: z
        .array(
          z.object({
            questionId: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
            answerId: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
          })
        )
        .nullable(),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
