import tools from "../../../../tools";
import sharp from "sharp";
import ico from "sharp-ico";
import logo from "../assets/logo.png";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";
export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro/pwa/task-4]($)");
    // -----------------------------------------
    // file name
    const fileName = "favicon.ico";
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microService,
      "./services/pwa/dist/pwa",
    );
    const fullNameInWriteDir = jetpack.path(writeDir, fileName);

    // generate ico
    const bufferLogo = await sharp(logo)
      .resize({ width: 64, height: 64 })
      .toBuffer();
    const bufferIco = ico.encode([bufferLogo]);
    jetpack.write(fullNameInWriteDir, bufferIco);
    console.log("ico created, writed");
    next()

    // -----------------------------------------
  });
};
