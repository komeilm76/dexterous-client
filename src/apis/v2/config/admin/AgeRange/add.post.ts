import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/AgeRange/add`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.object({
      title: z.string().nullable(),
      from: z.number().int(),
      to: z.number().int(),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
