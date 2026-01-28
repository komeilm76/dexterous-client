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
    const { log } = tools.logger.instance("[micro/pwa/task-4]($)");
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
    const screenShotsDir = jetpack.path(writeDir, "screenshots");

    const screenshotPathList = await jetpack.findAsync(screenShotsDir, {
      files: true,
      recursive: false,
    });

    for await (const path of screenshotPathList) {
      const inspect = await jetpack.inspectAsync(path);
      if (inspect) {
        const screenshotBuffer = await jetpack.readAsync(path, "buffer");
        const screenShotFile = sharp(screenshotBuffer);
        const { width, height, format } = await screenShotFile.metadata();
        const defaultFormFactor = "narrow";
        const form_factor =
          width > height
            ? "wide"
            : width < height
              ? "narrow"
              : defaultFormFactor;

        config.manifest.screenshots.push({
          src: `/pwa/screenshots/${inspect.name}`,
          sizes: `${width}x${height}`,
          form_factor: form_factor,
          // @ts-ignore
          type: `image/${format}`,
        });
      }
    }

    log("screenshots info pushed to manifest config");

    const iconsDir = jetpack.path(writeDir, "icons");
    const iconPathList = await jetpack.findAsync(iconsDir, {
      files: true,
      recursive: false,
    });

    for await (const path of iconPathList) {
      const inspect = await jetpack.inspectAsync(path);
      if (inspect) {
        const screenshotBuffer = await jetpack.readAsync(path, "buffer");
        const screenShotFile = sharp(screenshotBuffer);
        const { width, height, format } = await screenShotFile.metadata();

        config.manifest.icons.push({
          src: `/pwa/icons/${inspect.name}`,
          sizes: `${width}x${height}`,
          // @ts-ignore
          type: `image/${format}`,
        });
      }
    }
    log("icons info pushed to manifest config");
    const writePath = jetpack.path(writeDir, "manifest.json");
    jetpack.writeAsync(writePath, config.manifest);
    log("manifest.json created in writedDir");
    next();

    // -----------------------------------------
  });
};
