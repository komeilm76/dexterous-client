import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/pwa/task-6]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(tools.directories.microModules, "./pwa");
    // Use Directory
    const useDir = jetpack.path(tools.directories.public, "./pwa");
    // Assets Directory
    const readDir = jetpack.path(
      tools.directories.microService,
      "services",
      "pwa",
      "src",
      "assets",
    );

    jetpack.copyAsync(writeDir, useDir);
    log("writeDir Copied To useDir");

    next();

    // -----------------------------------------
  });
};
