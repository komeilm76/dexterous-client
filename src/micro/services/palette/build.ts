import kmPalette from "km-palette";
import jetpack from "fs-jetpack";

const build = async (config: ReturnType<typeof kmPalette.take>) => {
  const vuetifyConfig = kmPalette.generateVuetifyPalette(config.config as any);
  const { variables, dark, light, tailwind } = await kmPalette.makeCssAsString(
    config.config as any
  );
  const paletteFolder = jetpack.dir("./src/micro/services/palette/dist");
  const files = paletteFolder.find({ files: true, directories: false });
  files.forEach((item) => {
    paletteFolder.remove(item);
  });
  paletteFolder.write("vuetify-theme.json", vuetifyConfig);
  const listOfTakedPalette = config.names.map((item) => {
    return { name: item.toUpperCase(), key: item };
  });

  paletteFolder.write(
    "palette-types.ts",
    [
      `export type IPaletteType = ${config.names
        .map((i) => `"${i}"`)
        .join(" | ")}`,
    ].join("\n")
  );

  paletteFolder.write("palette-list.json", listOfTakedPalette);
  paletteFolder.write(`${tailwind.name}.css`, tailwind.css);
  variables.forEach((item) => {
    paletteFolder.write(`${item.cssFileName}`, item.css);
  });
  dark.forEach((item) => {
    paletteFolder.write(`${item.cssFileName}`, item.css);
  });
  light.forEach((item) => {
    paletteFolder.write(`${item.cssFileName}`, item.css);
  });
};
export default build;
