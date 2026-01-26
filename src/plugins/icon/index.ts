import { registerIconFonts } from "./../../micro-service/services/icon/dist/icon-fonts";

const install = async () => {
  return await registerIconFonts();
};
export default { install };
