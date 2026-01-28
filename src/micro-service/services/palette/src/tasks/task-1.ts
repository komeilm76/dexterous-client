import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import kmPalette from "km-palette";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig["useConfig"]>(
    async (config, next) => {
      // log
      const { log } = tools.logger.instance("[micro/palette/task-1]($)");
      // -----------------------------------------
      // file name
      const fileName = "vuetify-theme.json";
      // Write Directory
      const writeDir = jetpack.path(
        tools.directories.microModules,
        "./palette",
      );
      const useDir = jetpack.path(tools.directories.root, "./");
      const useConfig = kmPalette.take<IConfig["takedPaletteGenerics"]>(
        config.palettes,
        config.takedPalettes,
      );
      const vuetifyConfig = kmPalette.generateVuetifyPalette(
        useConfig.config as any,
      );
      const { variables, dark, light, tailwind } =
        await kmPalette.makeCssAsString(useConfig.config as any);

      jetpack.dir(writeDir).write(fileName, vuetifyConfig);
      log("vuetify theme writed");
      next();
    },
  );
};
