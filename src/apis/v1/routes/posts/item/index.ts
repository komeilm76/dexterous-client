import { makeApiConfig, makeResponseSuccessShape } from "km-api";
import z from "zod";
import components from "../../../components";

const apiSchema = makeApiConfig({
  method: "GET",
  pathShape: "/posts/{slug}",
  auth: "NO",
  responseContentType: "application/json",
  summary: "Get post by slug",
  request: {
    body: z.any(),
    params: z.object({ slug: z.string() }),
    query: z.object({}),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    200: makeResponseSuccessShape(components.post.postSchema, "post").item(),
    404: components.common.errorSchema,
  },
});

export default { apiSchema };
