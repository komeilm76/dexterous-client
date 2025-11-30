import kmPalette from "km-palette";
import type {} from "km-palette";
import paletteConfig from "km-palette/assets/config-default-theme.json" with {type:'json'};

import jetpack from "fs-jetpack";
const takedConfig = kmPalette.take(paletteConfig, {
  winter:true,
  // fall:true,
  // default:true
  bumbleBee:true
});

const vuetifyConfig = kmPalette.generateVuetifyPalette(
  takedConfig.config as any
);
const { variables, dark, light, tailwind } = await kmPalette.makeCssAsString(
  takedConfig.config as any
);
const paletteFolder = jetpack.dir("./src/micro/palette/dist");
const files = paletteFolder.find({ files: true, directories: false });
files.forEach((item) => {
  paletteFolder.remove(item);
});
paletteFolder.write("vuetify-theme.json", vuetifyConfig);
const listOfTakedPalette = takedConfig.names.map((item) => {
  return { title: item.toUpperCase(), key: item };
});
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
