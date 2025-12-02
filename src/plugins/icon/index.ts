import { importFontawesome } from "@/micro/services/icon/dist/fonts";

const install = async () => {
  return await importFontawesome();
};
export default { install };
