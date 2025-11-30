import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Question/update`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.object({
      id: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      questionSectionId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      title: z.string().nullable(),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
