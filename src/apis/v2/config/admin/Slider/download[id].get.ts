import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Slider/download`,
  method: "get",
  auth: "YES",
  disable: "NO",
  responseType: "blob",
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
    data: z.instanceof(Blob),
  },
});
export default { config };
