import tools from "../../../../tools";
import sharp from "sharp";
import ico from "sharp-ico";
import logo from "../assets/logo.png";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";
export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro/pwa/task-5]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microService,
      "./services/pwa/dist",
    );
    // Use Directory
    const useDir = jetpack.path(tools.directories.public);

    if (writeDir !== useDir) {
      const nodes = tools.nodes.getNodePaths(writeDir);
      nodes.files.forEach((node) => {
        jetpack.copyAsync(writeDir, useDir, { overwrite: true }).then((res) => {
          log("writed files copy to 'useDir'");
        });
      });
    }
    log("public folder updated");
    // -----------------------------------------
  });
};
