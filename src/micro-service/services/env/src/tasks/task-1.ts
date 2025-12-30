import jetpack from "fs-jetpack";
import tools from "../../../../tools";
import type { IConfig } from "../types";

export default () => {
  return tools.controller.makeMiddleware<IConfig>((config, next) => {
    const { log } = tools.logger.instance("[micro/env/task-1]($)");
    log("start");
    // -----------------------------------------
    // Write Directory
    const removeDir = jetpack.path(
      tools.directories.microService,
      "./services/env/dist",
    );
    // Use Directory
    const useDir = jetpack.path(tools.directories.public, "./env");
    Promise.all([
      jetpack.removeAsync(removeDir),
      jetpack.removeAsync(useDir),
    ]).then((res) => {
      log("removed files from 'writeDir' & 'useDir'");
      next();
    });
    // -----------------------------------------
  });
};
