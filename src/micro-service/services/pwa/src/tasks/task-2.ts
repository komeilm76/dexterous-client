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
    const { log } = tools.logger.instance("[micro/pwa/task-2]($)");
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
      "screenshots",
    );

    // list of screenshots
    const screenshotPathList = await jetpack
      .dir(readDir)
      .findAsync({ files: true });

    let imageIndex = 0;
    for await (const shot of screenshotPathList) {
      imageIndex++;
      const shotPath = jetpack.path(readDir, shot);
      const shotFile = await jetpack.readAsync(shotPath, "buffer");
      const { format, width, height } = await sharp(shotFile, {}).metadata();
      const defaultFormFactor = "narrow";
      const form_factor =
        width > height ? "wide" : width < height ? "narrow" : defaultFormFactor;
      const shotFileName = `screenshot-${imageIndex}-${width}x${height}_${form_factor}.${format}`;
      const fullFilePathWithName = `/screenshots/${shotFileName}`;
      const fullStaticFilePathWithName = jetpack.path(
        writeDir,
        makeValidPathFromManifest(fullFilePathWithName),
      );
      const imageDetails = {
        staticSrc: fullStaticFilePathWithName,
        src: fullFilePathWithName,
        sizes: `${width}x${height}`,
        form_factor: form_factor,
        // @ts-ignore
        type: `image/${format}`,
      };
      if (shotFile) {
        await jetpack.writeAsync(
          jetpack.path(imageDetails.staticSrc),
          shotFile,
        );
      }
    }
    log("created screenshots in writed directory");
    next();

    // -----------------------------------------
  });
};
