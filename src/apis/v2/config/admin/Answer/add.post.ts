import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Answer/add`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.object({
      questionId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      title: z.string().nullable(),
      score: z.number().transform((v) => {
        /* v is float number */ return v;
      }),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
