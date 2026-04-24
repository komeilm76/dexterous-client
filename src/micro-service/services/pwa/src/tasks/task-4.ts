import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";
import sharp from "sharp";

const makeValidPathFromManifest = (path: string) => {
  if (path.startsWith("./")) {
    return path;
  } else if (path.startsWith("/")) {
    return `.${path}`;
  } else {
    return `./${path}`;
  }
};

export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/pwa/task-4]($)");
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
    // Screenshot Directory
    const logoPath = jetpack.path(readDir, "logo.png");
    const logoBuffer = jetpack.read(logoPath, "buffer");
    const logoFile = sharp(logoBuffer);
    for await (const size of config.iconSizes) {
      const { format } = await logoFile.metadata();
      const icon = await logoFile
        .resize({ width: size, height: size })
        .toBuffer();
      const writePath = jetpack.path(
        writeDir,
        "icons",
        `icon-${size}x${size}.${format}`,
      );
      await jetpack.writeAsync(writePath, icon);
    }
    log("created icons from logo in writed directory");
    next();

    // -----------------------------------------
  });
};
