import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Exame/formula/get`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({
      Id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
    }),
    query: z.object({}),
  },
  response: {
    data: z.object({
      formula: z
        .array(
          z.object({
            questionSectionId: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
            formula: z
              .array(
                z.object({
                  fromScore: z.number().transform((v) => {
                    /* v is float number */ return v;
                  }),
                  toScore: z.number().transform((v) => {
                    /* v is float number */ return v;
                  }),
                  value: z.string().nullable(),
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
