import kmStorage from "km-storage";
import z from "zod";

const lStorageSchema = z.object({
  tabs: z.string().array(),
});
export const lStorage = kmStorage.install(lStorageSchema, {
  editManualy: true,
  compress: false,
  mode: "localStorage",
  prefix: "dexterous-client",
});
