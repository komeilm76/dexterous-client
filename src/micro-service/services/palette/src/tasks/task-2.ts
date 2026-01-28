import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import kmPalette from "km-palette";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig["useConfig"]>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro/palette/task-2]($)");
    // -----------------------------------------
    // file name
    const fileName = "palette-types.ts";
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microModules,
      "./palette",
    );
    const useDir = jetpack.path(tools.directories.root, "./");
    const useConfig = kmPalette.take<IConfig['takedPaletteGenerics']>(
      config.palettes,
      config.takedPalettes,
    );

    jetpack
      .dir(writeDir)
      .write(
        fileName,
        [
          `export type IPaletteType = ${useConfig.names
            .map((i) => `"${i}"`)
            .join(" | ")}`,
        ].join("\n"),
      );
    log("types writed");
    next()
  });
};
