import {
  makeApiConfig,
  makeResponseSuccessShape,
  paginationSchema,
} from "km-api";
import z from "zod";
import components from "../../../components";

const apiSchema = makeApiConfig({
  method: "GET",
  pathShape: "/posts",
  auth: "NO",
  responseContentType: "application/json",
  summary: "List all posts",
  request: {
    body: z.any(),
    params: z.object({}),
    query: z.object({
      page: z.number().int().min(1).optional(),
      limit: z.number().int().max(100).optional(),
      tag: z.string().optional(),
    }),
    headers: z.object({}),
    cookies: z.object({}),
  },
  response: {
    200: makeResponseSuccessShape(components.post.postSchema, "posts").list(
      paginationSchema(),
    ),
  },
});
export default { apiSchema };
