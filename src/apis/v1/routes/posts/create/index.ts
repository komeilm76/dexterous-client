import { makeApiConfig, makeResponseSuccessShape } from "km-api";
import z from "zod";
import components from "../../../components";

const apiSchema = makeApiConfig({
  method: "POST",
  pathShape: "/posts",
  auth: "YES",
  requestContentType: "application/json",
  responseContentType: "application/json",
  summary: "Create a new post",
  tags: ["#posts", "#write"],
  request: {
    body: z.object({
      title: z.string().min(3).max(200),
      content: z.string().min(10),
      tags: z.array(z.string()).optional(),
    }),
    params: z.object({}),
    query: z.object({}),
    headers: z.object({ Authorization: z.string() }),
    cookies: z.object({}),
  },
  response: {
    '201': makeResponseSuccessShape(components.post.postSchema, "post").item(),
    '400': components.common.errorSchema,
    '401': components.common.errorSchema,
  },
});

export default { apiSchema };
