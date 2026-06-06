import { makeApiConfig } from "km-api";
import z from "zod";
import components from "../../../components";

const apiSchema = makeApiConfig({
  method: "DELETE",
  pathShape: "/posts/{id}",
  auth: "YES",
  summary: "Delete a post",
  request: {
    body: z.any(),
    params: z.object({ id: z.string().uuid() }),
    query: z.object({}),
    headers: z.object({ Authorization: z.string() }),
    cookies: z.object({}),
  },
  response: {
    204: z.object({}),
    403: components.common.errorSchema,
    404: components.common.errorSchema,
  },
});

export default { apiSchema };
