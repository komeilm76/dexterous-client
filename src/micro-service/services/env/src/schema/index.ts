import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";
import { zodToTs } from "zod-to-ts";

// font
const fontSchema = z
  .union([
    z.literal("Vazirmatn"),
    z.literal("Noto Nastaliq Urdu"),
    z.literal("Roboto"),
    z.literal("Beiruti"),
    z.literal("Gulzar"),
    z.literal("Lalezar"),
    z.literal("Caveat"),
  ])

  .default("Beiruti");
const fontsSchema = z.record(fontSchema.def.innerType, z.boolean()).default({
  Beiruti: true,
  "Noto Nastaliq Urdu": false,
  Caveat: false,
  Gulzar: false,
  Lalezar: false,
  Roboto: false,
  Vazirmatn: false,
});

// language
const languageSchema = z
  .union([z.literal("en"), z.literal("fa")])
  .default("en");
const languagesSchema = z
  .record(languageSchema.def.innerType, z.boolean())
  .default({ en: true, fa: false });

// zod schema
const configSchema = z.object({
  $schema: z.string().optional().default("./schema.json"),
  baseUrl: z.string().default("http://localhost:8097"),
  setting: z.object({
    font: z.object({
      default: fontSchema,
      fonts: fontsSchema,
    }),
    language: z.object({
      default: languageSchema,
      languages: languagesSchema,
    }),
  }),
});

// config type
export type IConfig = {
  data: z.infer<typeof configSchema>;
  schema: typeof configSchema;
};
export default { config: configSchema };

type ToUnionShape<T> = [T, T];
type IChangeShape<OBJECT extends object> = {
  [key in keyof OBJECT]: ToUnionShape<OBJECT[key]>;
};
