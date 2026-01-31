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
    const { log } = tools.logger.instance("[micro-service/pwa/task-2]($)");
    // -----------------------------------------
    // file name
    const fileName = "manifest.json";
    // Write Directory
    const writeDir = jetpack.path(tools.directories.microModules, "./pwa");
    // Assets Directory
    const assetsDir = jetpack.path(
      tools.directories.microService,
      "./services/pwa/src/assets",
    );
    // Screenshot controller
    const screenShotDir = jetpack.path(assetsDir, "screenshots");

    const screenshots = await jetpack
      .dir(screenShotDir)
      .findAsync({ files: true });
    let imageIndex = 0;
    for await (const shot of screenshots) {
      imageIndex++;
      const shotPath = jetpack.path(screenShotDir, shot);
      const shotFile = await jetpack.readAsync(shotPath, "buffer");
      const { format, width, height } = await sharp(shotFile, {}).metadata();

      const defaultFormFactor = "narrow";
      const form_factor =
        width > height ? "wide" : width < height ? "narrow" : defaultFormFactor;
      const shotFileName = `screenshot-${imageIndex}-${width}x${height}_${form_factor}.${format}`;
      const fullFilePathWithName = `/screenshots/${shotFileName}`;
      config.manifest.screenshots.push({
        src: fullFilePathWithName,
        sizes: `${width}x${height}`,
        form_factor: form_factor,
        // @ts-ignore
        type: `image/${format}`,
      });
      console.log("config", config.manifest.screenshots);
      if (shotFile) {
        await jetpack.writeAsync(
          jetpack.path(
            writeDir,
            makeValidPathFromManifest(fullFilePathWithName),
          ),
          shotFile,
        );
      }
    }

    // icons controller
    const iconFullPAth = jetpack.path(assetsDir, "logo.png");
    console.log("iconFullPAth", iconFullPAth);

    const iconFile = await jetpack.readAsync(iconFullPAth, "buffer");
    const { format } = await sharp(iconFile).metadata();

    for await (const size of config.iconSizes) {
      config.manifest.icons.push({
        src: `/icons/icon-${size}x${size}.${format}`,
        sizes: `${size}x${size}`,
        // @ts-ignore
        type: `image/${format}`,
      });
    }
    const fullNameInWriteDir = jetpack.path(writeDir, fileName);
    jetpack.write(fullNameInWriteDir, config.manifest);
    log("writed manifest file");
    next();

    // -----------------------------------------
  });
};
