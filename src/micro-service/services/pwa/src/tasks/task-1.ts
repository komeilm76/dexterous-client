import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro/pwa/task-1]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(tools.directories.microModules, "./pwa");
    const useDir = jetpack.path(tools.directories.public, "./pwa");
    await jetpack.removeAsync(writeDir);
    log("writed directory removed");
    await jetpack.removeAsync(useDir);
    log("used directory removed");
    next();
    // -----------------------------------------
  });
};
