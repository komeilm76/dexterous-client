import kmPalette from "km-palette";

import alreadyPalettes from "km-palette/assets/config-default-theme.json" with { type: "json" };
import type { IConfig } from "./schemas";

const takedPalettes: IConfig["useConfig"]["takedPalettes"] = {
  default: true,
  pastel: true,
  wood: false,
  neo: false,
  chroma: false,
  bumbleBee: false,
  ocean: false,
  ston: false,
  neon: false,
  spring: false,
  winter: false,
  fall: false,
  summer: false,
  water: false,
  hell: false,
  heaven: false,
  sunrise: false,
  moon: false,
  office: false,
  sport: false,
  company: false,
  jungle: false,
  food: false,
  coffee: false,
  cyberpunk: false,
  galaxy: false,
  retro: false,
  minimal: false,
};

const palettes = kmPalette.makeConfig<IConfig["makedPaletteGenerics"]>(
  alreadyPalettes as unknown as ReturnType<
    typeof kmPalette.makeConfig<IConfig["makedPaletteGenerics"]>
  >,
);

export default {
  takedPalettes,
  palettes,
};
