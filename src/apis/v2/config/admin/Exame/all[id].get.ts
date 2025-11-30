import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Exame/all`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({
      id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
    }),
    query: z.object({}),
  },
  response: {
    data: z.object({
      id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      title: z.string().nullable(),
      description: z.string().nullable(),
      created: z.string().nullable(),
      code: z.string().nullable(),
      questions: z
        .array(
          z.object({
            id: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
            title: z.string().nullable(),
            questionSection: z.object({
              id: z.string().transform((v) => {
                /* v is int64 */ return v;
              }),
              title: z.string().nullable(),
              code: z.string().nullable(),
            }),
            answers: z
              .array(
                z.object({
                  id: z.string().transform((v) => {
                    /* v is int64 */ return v;
                  }),
                  title: z.string().nullable(),
                  score: z.number().transform((v) => {
                    /* v is float number */ return v;
                  }),
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
