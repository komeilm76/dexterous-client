import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Exame/formula/set`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.object({
      id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      formulas: z
        .array(
          z.object({
            questionSectionId: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
            formulas: z
              .array(
                z.object({
                  fromScore: z.number().transform((v) => {
                    /* v is float number */ return v;
                  }),
                  toScore: z.number().transform((v) => {
                    /* v is float number */ return v;
                  }),
                  value: z.number().int(),
                  description: z.string().nullable(),
                })
              )
              .nullable(),
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
