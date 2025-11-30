import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/pub/Common/province/select`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.array(
      z.object({
        id: z.string().transform((v) => {
          /* v is int64 */ return v;
        }),
        title: z.string().nullable(),
      })
    ),
  },
});
export default { config };
