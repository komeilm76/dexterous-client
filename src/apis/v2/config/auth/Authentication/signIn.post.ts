import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/auth/Authentication/signIn`,
  method: "post",
  auth: "NO",
  disable: "NO",
  request: {
    body: z.object({
      userName: z.string().nullable(),
      password: z.string().nullable(),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({
      token: z.string(),
    }),
  },
});
export default { config };
