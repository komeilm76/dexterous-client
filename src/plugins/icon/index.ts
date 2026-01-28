import { registerIconFonts } from "@/micro-modules/icon/icon-fonts";

const install = async () => {
  return await registerIconFonts();
};
export default { install };
