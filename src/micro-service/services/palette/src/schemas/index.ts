import type kmPalette from "km-palette";

type IPaletteType = kmPalette.Type;

type IPaletteMode = kmPalette.Mode;
type IPaletteColor = kmPalette.Color;
type IPaletteTakeGeneric = [IPaletteType, IPaletteColor, IPaletteMode];
type IPaletteMakeGeneric = ["YES", IPaletteType, IPaletteColor, IPaletteMode];

export type IConfig = {
  types: IPaletteType;
  takedPaletteGenerics: IPaletteTakeGeneric;
  makedPaletteGenerics: IPaletteMakeGeneric;
  useConfig: {
    takedPalettes: Record<IPaletteType, boolean>;
    palettes: ReturnType<typeof kmPalette.makeConfig<IPaletteMakeGeneric>>;
  };
};
