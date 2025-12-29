import jetpack from "fs-jetpack";
import tools from "../../../tools";
import kmPalette from "km-palette";
import type {
  IPaletteMakeGeneric,
  IPaletteTakeGeneric,
  IPaletteType,
} from "./config";

type IOption = {
  renderAgainOnChange: boolean;
  copyAfterRender: boolean;
};

const build = async (
  palettes: ReturnType<typeof kmPalette.makeConfig<IPaletteMakeGeneric>>,
  options: Record<IPaletteType, boolean>,
) => {
  // log
  const step = { value: 0 };
  const logLabel = "[micro/palette]($)";
  tools.logger.log(step, logLabel, "start");
  // -----------------------------------------
  // file name
  const fileName = "index.html";
  // Write Directory
  const writeDir = jetpack.path(
    tools.directories.microService,
    "./services/palette/dist",
  );
  const fullNameInWriteDir = jetpack.path(writeDir, fileName);
  // Use Directory
  const useDir = jetpack.path(tools.directories.root, "./");
  const fullNameInUseDir = jetpack.path(useDir, fileName);

  const useConfig = kmPalette.take<IPaletteTakeGeneric>(palettes, options);

  const vuetifyConfig = kmPalette.generateVuetifyPalette(
    useConfig.config as any,
  );
  const { variables, dark, light, tailwind } = await kmPalette.makeCssAsString(
    useConfig.config as any,
  );

  jetpack.dir(writeDir).write("vuetify-theme.json", vuetifyConfig);
  tools.logger.log(step, logLabel, "vuetify theme writed");

  const listOfTakedPalette = useConfig.names.map((item) => {
    return { name: item.toUpperCase(), key: item };
  });

  jetpack
    .dir(writeDir)
    .write(
      "palette-types.ts",
      [
        `export type IPaletteType = ${useConfig.names
          .map((i) => `"${i}"`)
          .join(" | ")}`,
      ].join("\n"),
    );
  tools.logger.log(step, logLabel, "types writed");

  jetpack.dir(writeDir).write("palette-list.json", listOfTakedPalette);
  tools.logger.log(step, logLabel, "list  writed");
  
  jetpack.dir(writeDir).write(`${tailwind.name}.css`, tailwind.css);
  tools.logger.log(step, logLabel, "tailwind  writed");

  variables.forEach((item) => {
    jetpack.dir(writeDir).write(`${item.cssFileName}`, item.css);
  });
  tools.logger.log(step, logLabel, "variables  writed");
  dark.forEach((item) => {
    jetpack.dir(writeDir).write(`${item.cssFileName}`, item.css);
  });
  tools.logger.log(step, logLabel, "dark css  writed");
  light.forEach((item) => {
    jetpack.dir(writeDir).write(`${item.cssFileName}`, item.css);
  });
    tools.logger.log(step, logLabel, "light css  writed");
  // -----------------------------------------
};
export default build;
