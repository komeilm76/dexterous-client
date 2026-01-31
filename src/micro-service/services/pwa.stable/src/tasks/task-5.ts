import tools from "../../../../tools";
import sharp from "sharp";
import ico from "sharp-ico";
import logo from "../assets/logo.png";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";
export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/pwa/task-5]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(tools.directories.microModules, "./pwa");
    // Use Directory
    const useDir = jetpack.path(tools.directories.public);

    if (writeDir !== useDir) {
      jetpack.copyAsync(writeDir, useDir);
    }
    log("public folder updated");
    // -----------------------------------------
  });
};
