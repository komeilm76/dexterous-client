import jetpack from "fs-jetpack";
import tools from "../../../../tools";
import type { IConfig } from "../schema";

export default () => {
  return tools.controller.makeMiddleware<IConfig>((config, next) => {
    const { log } = tools.logger.instance("[micro-service/env/task-1]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microModules,
      "./env",
    );
    // Use Directory
    const useDir = jetpack.path(tools.directories.public, "./env");
    Promise.all([
      jetpack.removeAsync(writeDir),
      // jetpack.removeAsync(useDir),
    ]).then((res) => {
      log("removed files from 'writeDir' & 'useDir'");
      next();
    });
    // -----------------------------------------
  });
};
