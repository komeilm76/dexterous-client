import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/pwa/task-1]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(tools.directories.microModules, "./pwa");
    const useDir = jetpack.path(tools.directories.root, "./");
    await jetpack.removeAsync(writeDir);
    log("writed folder removed");
    next();
    // -----------------------------------------
  });
};
