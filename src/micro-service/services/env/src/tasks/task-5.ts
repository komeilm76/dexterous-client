import jetpack from "fs-jetpack";
import tools from "../../../../tools";
import type { IConfig } from "../types";
import {
  zodToTs,
  createAuxiliaryTypeStore,
  createTypeAlias,
  printNode,
  type ZodToTsOptions,
} from "zod-to-ts";
import z from "zod";
import type { ZodType } from "zod/v4";

export default () => {
  return tools.controller.makeMiddleware<IConfig>((config, next) => {
    const { log } = tools.logger.instance("[micro/env/task-5]($)");
    log("start");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microService,
      "./services/env/dist",
    );
    // Use Directory
    const useDir = jetpack.path(tools.directories.public, "./env");

    if (writeDir !== useDir) {
      const nodes = tools.nodes.getNodePaths(writeDir);
      nodes.files.forEach((node) => {
        jetpack.copyAsync(writeDir, useDir, { overwrite: true }).then((res) => {
          log("writed files copy to 'useDir'");
        });
      });
    }
    // -----------------------------------------
  });
};
