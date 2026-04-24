import jetpack from "fs-jetpack";
import tools from "../../../../tools";

export default () => {
  return tools.controller.makeMiddleware((config, next) => {
    const { log } = tools.logger.instance(
      "[micro-service/service-worker/task-1]($)",
    );
    // -----------------------------------------
    // write Directory
    const writeDir = jetpack.path(
      tools.directories.microModules,
      "service-worker",
    );
    // use Directory
    const useDir = jetpack.path(tools.directories.public, "service-worker");

    Promise.all([jetpack.removeAsync(writeDir)]).then((res) => {
      log("removed files from 'writeDir' & 'useDir'");
      next();
    });
    // -----------------------------------------
  });
};
