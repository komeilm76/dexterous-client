import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Exame/add`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.object({
      title: z.string().nullable(),
      description: z.string().nullable(),
      categoryId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      ageRangeId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      code: z.string().nullable(),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
