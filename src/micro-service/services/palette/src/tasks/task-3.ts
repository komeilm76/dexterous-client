import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import kmPalette from "km-palette";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig["useConfig"]>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro/palette/task-3]($)");
    // -----------------------------------------
    // file name
    const fileName = "palette-list.json";
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microModules,
      "./palette",
    );

    const useConfig = kmPalette.take<IConfig['takedPaletteGenerics']>(
      config.palettes,
      config.takedPalettes,
    );
    const listOfTakedPalette = useConfig.names.map((item) => {
      return { name: item.toUpperCase(), key: item };
    });
    jetpack.dir(writeDir).write(fileName, listOfTakedPalette);
    log("list  writed");
    next()
  });
};
