import tools from "../../../../tools";
import kmPalette from "km-palette";
import jetpack from "fs-jetpack";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig["useConfig"]>(
    async (config, next) => {
      // log
      const { log } = tools.logger.instance("[micro/palette/task-6]($)");
      // -----------------------------------------
      // Write Directory
      const writeDir = jetpack.path(
        tools.directories.microService,
        "./services/palette/dist",
      );
      const useConfig = kmPalette.take<IConfig["takedPaletteGenerics"]>(
        config.palettes,
        config.takedPalettes,
      );
      const { variables, dark, light, tailwind } =
        await kmPalette.makeCssAsString(useConfig.config as any);
      dark.forEach((item) => {
        jetpack.dir(writeDir).write(`${item.cssFileName}`, item.css);
      });
      log("dark css  writed");
      light.forEach((item) => {
        jetpack.dir(writeDir).write(`${item.cssFileName}`, item.css);
      });
      log("light css  writed");
      next();
    },
  );
};
