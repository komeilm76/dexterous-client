import kmPalette, { kmIcon } from "km-icon";
import "km-icon/assets/fontawesome/v7/pro/imports/brands.css";
import jetpack from "fs-jetpack";

const build = async (config: kmIcon.iFontawesomeConfig) => {
  const { names } = kmIcon.fontawesome.makeConfig(config);

  const iconFolder = jetpack.dir("./src/micro/services/icon/dist");
  const files = iconFolder.find({ files: true, directories: false });
  files.forEach((item) => {
    iconFolder.remove(item);
  });
  const importAdresses = names
    .map((item) => {
      return `await import("km-icon/assets/fontawesome/v7/pro/imports/${item}.css")`;
    })
    .join("\n");
  iconFolder.write(
    "fonts.ts",
    [`export const importFontawesome = async ()=>{`, importAdresses, `}`].join(
      "\n"
    )
  );
};
export default build;
