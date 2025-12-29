import kmPalette from "km-palette";

export type IPaletteType = kmPalette.Type;
type IPaletteMode = kmPalette.Mode;
type IPaletteColor = kmPalette.Color;
export type IPaletteTakeGeneric = [IPaletteType, IPaletteColor, IPaletteMode];
export type IPaletteMakeGeneric = [
  "YES",
  IPaletteType,
  IPaletteColor,
  IPaletteMode,
];
import alreadyPalettes from "km-palette/assets/config-default-theme.json" with { type: "json" };
const takedPalettes: Record<IPaletteType, boolean> = {
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

const palettes = kmPalette.makeConfig<IPaletteMakeGeneric>(
  alreadyPalettes as unknown as ReturnType<
    typeof kmPalette.makeConfig<IPaletteMakeGeneric>
  >,
);

export default {
  takedPalettes,
  palettes,
};
