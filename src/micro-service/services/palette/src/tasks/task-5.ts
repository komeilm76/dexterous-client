import tools from "../../../../tools";
import kmPalette from "km-palette";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig["useConfig"]>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro/palette/task-5]($)");
    // -----------------------------------------
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microModules,
      "./palette",
    );
    const useConfig = kmPalette.take<IConfig['takedPaletteGenerics']>(
      config.palettes,
      config.takedPalettes,
    );

    const { variables, dark, light, tailwind } =
      await kmPalette.makeCssAsString(useConfig.config as any);

    variables.forEach((item) => {
      jetpack.dir(writeDir).write(`${item.cssFileName}`, item.css);
    });
    log("variables  writed");
    next()

  });
};
