import z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const zodSchema = z.object({
  baseUrl: z.string(),
  setting: z.object({}),
});

const toJsonSchema = () => {
  return zodToJsonSchema(zodSchema, {});
};

export type IEnvConfig = z.infer<typeof zodSchema>;

export default {
  zodSchema,
  jsonSchema: toJsonSchema(),
};
