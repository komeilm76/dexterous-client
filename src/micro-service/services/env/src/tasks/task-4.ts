import jetpack from "fs-jetpack";
import tools from "../../../../tools";
import type { IConfig } from "../schema";
import {
  zodToTs,
  createAuxiliaryTypeStore,
  createTypeAlias,
  printNode,
  type ZodToTsOptions,
} from "zod-to-ts";
import z from "zod";
import type { ZodType } from "zod/v4";

const convertZodToTs = (
  schema: ZodType,
  name: string,
  options: { exportMode: "disable" | "default" | "inline" },
) => {
  const node = zodToTs(schema, {
    auxiliaryTypeStore: createAuxiliaryTypeStore(),
  }).node;
  const raw = printNode(createTypeAlias(node, name));
  if (options.exportMode == "disable") {
    return raw;
  } else if (options.exportMode == "inline") {
    return `export ${raw}`;
  } else {
    return `export default ${raw}`;
  }
};

export default () => {
  return tools.controller.makeMiddleware<IConfig>((config, next) => {
    const { log } = tools.logger.instance("[micro-service/env/task-4]($)");
    // -----------------------------------------
    // file name
    const fileName = "types.ts";
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microModules,
      "./env",
    );
    const fullNameInWriteDir = jetpack.path(writeDir, fileName);
    // Use Directory
    const useDir = jetpack.path(tools.directories.public, "./env");
    const fullNameInUseDir = jetpack.path(useDir, fileName);

    const tsSchema = convertZodToTs(config.schema, "EnvConfig", {
      exportMode: "inline",
    });

    jetpack.writeAsync(fullNameInWriteDir, tsSchema).then((res) => {
      log("writed files to 'writeDir'");
      next();
    });
    // -----------------------------------------
  });
};
