import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Slider/add`,
  method: "post",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.instanceof(File).array(),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
