import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#F0F8FF",
    surface: "#E6F3FF",
    "surface-bright": "#FFFFFF",
    "surface-light": "#D4EBFF",
    "surface-variant": "#4682B4",
    "on-surface-variant": "#F0F8FF",
    primary: "#1E90FF",
    "primary-darken-1": "#1A7FE6",
    secondary: "#87CEEB",
    "secondary-darken-1": "#78BAD6",
    error: "#4169E1",
    info: "#00BFFF",
    success: "#20B2AA",
    warning: "#7B68EE",
  },
  dark: {
    background: "#0A1F35",
    surface: "#1A2F45",
    "surface-bright": "#2A3F55",
    "surface-light": "#14273D",
    "surface-variant": "#B0E0E6",
    "on-surface-variant": "#0A1F35",
    primary: "#B0E0E6",
    "primary-darken-1": "#9ED0D6",
    secondary: "#87CEEB",
    "secondary-darken-1": "#78BAD6",
    error: "#6495ED",
    info: "#00CED1",
    success: "#48D1CC",
    warning: "#9370DB",
  },
};
export default { palette };
