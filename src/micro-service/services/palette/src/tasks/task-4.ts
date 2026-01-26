import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import kmPalette from "km-palette";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig["useConfig"]>(
    async (config, next) => {
      // log
      const { log } = tools.logger.instance("[micro/palette/task-4]($)");
      // -----------------------------------------
      // file name
      const fileFormat = "css";
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

      jetpack
        .dir(writeDir)
        .write(`${tailwind.name}.${fileFormat}`, tailwind.css);
      log("tailwind  writed");
      next();
    },
  );
};
