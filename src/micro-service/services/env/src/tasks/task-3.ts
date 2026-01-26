import jetpack from "fs-jetpack";
import tools from "../../../../tools";
import type { IConfig } from "../schema";
import z from "zod/v4";

export default () => {
  return tools.controller.makeMiddleware<IConfig>((config, next) => {
    const { log } = tools.logger.instance("[micro/env/task-3]($)");
    // -----------------------------------------
    // file name
    const fileName = "schema.json";
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microService,
      "./services/env/dist",
    );
    const fullNameInWriteDir = jetpack.path(writeDir, fileName);
    // Use Directory
    const useDir = jetpack.path(tools.directories.public, "./env");
    const fullNameInUseDir = jetpack.path(useDir, fileName);
    const jsonSchema = z.toJSONSchema(config.schema);
    jetpack.writeAsync(fullNameInWriteDir, jsonSchema).then((res) => {
      log("writed files to 'writeDir'");
    });
    next();
    // -----------------------------------------
  });
};
