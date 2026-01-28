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
  // @ts-ignore
  dexterous: true,
};

// const palettes = kmPalette.makeConfig<IConfig["makedPaletteGenerics"]>(
//   alreadyPalettes as unknown as ReturnType<
//     typeof kmPalette.makeConfig<IConfig["makedPaletteGenerics"]>
//   >,
// );

const palettes = kmPalette.makeConfig<IConfig["makedPaletteGenerics"]>({
  dexterous: {
    light: {
      background: "#FFFFFF",
      surface: "#F2F3F5",
      "surface-bright": "#FFFFFF",
      "surface-light": "#E6E8EB",

      "surface-variant": "#3A3F45",
      "on-surface-variant": "#FFFFFF",

      primary: "#4A4F55",
      "primary-darken-1": "#2F3338",

      secondary: "#8A8F96",
      "secondary-darken-1": "#6F747A",

      error: "#B3261E",
      info: "#5B7C99",
      success: "#3F7F5F",
      warning: "#C9A227",
    },

    dark: {
      background: "#0E0F11",
      surface: "#16181C",
      "surface-bright": "#1F2227",
      "surface-light": "#121418",

      "surface-variant": "#BFC3C8",
      "on-surface-variant": "#0E0F11",

      primary: "#D0D3D8",
      "primary-darken-1": "#A9ADB3",

      secondary: "#8E9399",
      "secondary-darken-1": "#6F747A",

      error: "#CF6679",
      info: "#7FA0C3",
      success: "#6FAF8F",
      warning: "#E0C35A",
    },
  },
  default: {
    light: {
      background: "#FFFFFF",
      surface: "#FFFFFF",
      "surface-bright": "#FFFFFF",
      "surface-light": "#EEEEEE",
      "surface-variant": "#424242",
      "on-surface-variant": "#EEEEEE",
      primary: "#1867C0",
      "primary-darken-1": "#1F5592",
      secondary: "#48A9A6",
      "secondary-darken-1": "#018786",
      error: "#B00020",
      info: "#2196F3",
      success: "#4CAF50",
      warning: "#FB8C00",
    },
    dark: {
      background: "#121212",
      surface: "#212121",
      "surface-bright": "#ccbfd6",
      "surface-light": "#424242",
      "surface-variant": "#c8c8c8",
      "on-surface-variant": "#000000",
      primary: "#2196F3",
      "primary-darken-1": "#277CC1",
      secondary: "#54B6B2",
      "secondary-darken-1": "#48A9A6",
      error: "#CF6679",
      info: "#2196F3",
      success: "#4CAF50",
      warning: "#FB8C00",
    },
  },
} as unknown as ReturnType<
  typeof kmPalette.makeConfig<IConfig["makedPaletteGenerics"]>
>);

export default {
  takedPalettes,
  palettes,
};
