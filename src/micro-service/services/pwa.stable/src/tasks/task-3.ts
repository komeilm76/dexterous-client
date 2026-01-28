import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import sharp from "sharp";
import logo from "../assets/logo.png";
import type { IConfig } from "../schemas";

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
    const { log } = tools.logger.instance("[micro/pwa/task-3]($)");
    // -----------------------------------------
    // file name
    const fileName = "manifest.json";
    // Write Directory
    const writeDir = jetpack.path(tools.directories.microModules, "./pwa");

    // generate icons
    for await (const item of config.manifest.icons) {
      // @ts-ignore
      const [width, height] = item.sizes.split("x").map((i) => Number(i));
      const regex = /(png|jpg|svg|svg\+xml)/g;
      const findedFormat = item.type?.match(regex);
      const format = !!findedFormat
        ? (findedFormat["0"] as "png" | "svg" | "jpg")
        : undefined;
      if (format) {
        const icon = await sharp(logo)
          .resize({ width, height })
          .toFormat(format)
          .toBuffer();
        const fullNameInWriteDir = jetpack.path(
          writeDir,
          makeValidPathFromManifest(item.src),
        );
        await jetpack.writeAsync(fullNameInWriteDir, icon);
      }
    }
    log("icons created, writed");
    next();

    // -----------------------------------------
  });
};
