import z from "zod/v4";
import zodToJsonSchema from "zod-to-json-schema";
import { zodToTs } from "zod-to-ts";
// zod schema
const schema = z.object({
  $schema: z.string().optional(),
  baseUrl: z.string(),
  setting: z.object({}),
});

// config type
export type IConfig = {
  data: z.infer<typeof schema>;
  schema: typeof schema;
};
export default { schema };
