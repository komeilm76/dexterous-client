import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";
import sharpIco from "sharp-ico";
import sharp from "sharp";

export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/pwa/task-6]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(tools.directories.microModules, "./pwa");
    // Assets Directory
    const readDir = jetpack.path(
      tools.directories.microService,
      "services",
      "pwa",
      "src",
      "assets",
    );

    const logoPath = jetpack.path(readDir, "logo.png");
    console.log("logoPath", logoPath);
    const logoBuffer = await jetpack.readAsync(logoPath, "buffer");
    const writePath = jetpack.path(writeDir, "favicon.ico");
    const logoFile = await sharp(logoBuffer)
      .resize({ width: 256, height: 256 })
      .flatten({ background: config.manifest.background_color })
      .toBuffer();
    const icoFile = sharpIco.encode([logoFile]);
    await jetpack.writeAsync(writePath, icoFile);
    log("favicon.ico created in writeDir");
    next();

    // -----------------------------------------
  });
};
