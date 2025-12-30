import jetpack from "fs-jetpack";
import tools from "../../../../tools";
import type { IConfig } from "../types";

export default () => {
  return tools.controller.makeMiddleware<IConfig>((config, next) => {
    const { log } = tools.logger.instance("[micro/env/task-2]($)");
    log("start");
    // -----------------------------------------
    // file name
    const fileName = "config.json";
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microService,
      "./services/env/dist",
    );
    const fullNameInWriteDir = jetpack.path(writeDir, fileName);
    // Use Directory
    const useDir = jetpack.path(tools.directories.public, "./env");
    const fullNameInUseDir = jetpack.path(useDir, fileName);
    jetpack.writeAsync(fullNameInWriteDir, config.data).then((res) => {
      log("writed files to 'writeDir'");
    });
    next()
    // -----------------------------------------
  });
};
