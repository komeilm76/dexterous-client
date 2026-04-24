import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";
import sharp from "sharp";

const formatOfLogo = async (logoDir: string) => {
  const logoPathList = await jetpack.findAsync(logoDir, { recursive: false });
  console.log("logoPathList", logoPathList);

  const existedLogos = [];
  for await (const path of logoPathList) {
    const info = jetpack.inspect(path);
    if (info) {
      existedLogos.push(info.name);
    }
  }
  const pngExist = !!existedLogos.find((item) => item == "logo.png");
  const svgExist = !!existedLogos.find((item) => item == "logo.svg");
  if (svgExist) {
    return "logo.svg";
  }
  if (pngExist) {
    return "logo.png";
  } else {
    throw new Error(
      "logo is required. please add logo to this path: src/micro-service/pwa/assets/logo.(png | svg)",
    );
  }
};

export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/pwa/task-3]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(tools.directories.microModules, "./pwa");
    // Screenshot Directory
    const readDir = jetpack.path(
      tools.directories.microService,
      "services",
      "pwa",
      "src",
      "assets",
    );
    console.log("readDir", readDir);

    const logoName = await formatOfLogo(readDir);
    if (logoName == "logo.svg") {
      const logoPath = jetpack.path(readDir, logoName);
      const logoBuffer = await jetpack.readAsync(logoPath, "buffer");
      const logoFile = await sharp(logoBuffer).toFormat("png").toBuffer();
      const pngLogoPath = jetpack.path(readDir, "logo.png");
      await jetpack.writeAsync(pngLogoPath, logoFile);
    }
    log("(created | overwrited) png logo from svg in readDir");
    next();

    // -----------------------------------------
  });
};
