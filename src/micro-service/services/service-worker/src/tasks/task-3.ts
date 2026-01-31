import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import { build, defineConfig, type NormalizedOptions } from "tsup";
import { config } from "../config";
import type { IConfig } from "../schemas";

const makeRelativeFromStaticPath = (staticPath: string) => {
  const clearPath = staticPath
    .replace(tools.directories.root, "")
    .split("\\")
    .join("/");
  if (clearPath.startsWith("/")) {
    return clearPath.substring(1);
  } else {
    return clearPath;
  }
};

export default () => {
  return tools.controller.makeMiddleware(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/service-worker/task-3]($)");
    log("build start");

    // write Directory
    const writedDir = jetpack.path(
      tools.directories.microModules,
      "service-worker",
    );

    // read Directory
    const readDir = jetpack.path(
      tools.directories.microService,
      "services",
      "service-worker",
      "src",
      "source",
    );

    const staticReadFilePath = jetpack.path(readDir, "index.ts");
    const relativeReadFilePath = makeRelativeFromStaticPath(staticReadFilePath);

    // use Directory
    const useDir = jetpack.path(tools.directories.public, "service-worker");

    await jetpack.copyAsync(writedDir, useDir, { overwrite: true });

    tools.watcher.watchFiles(
      [relativeReadFilePath],
      async () => {
        await jetpack.copyAsync(writedDir, useDir, { overwrite: true });
        log("source was updated in useDir");
      },
      1000,
    );

    log("build finished");
    next();

    // -----------------------------------------
  });
};
