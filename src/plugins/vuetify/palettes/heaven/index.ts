import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#E6F3FF",
    surface: "#D4EBFF",
    "surface-bright": "#F0F8FF",
    "surface-light": "#C4E1FF",
    "surface-variant": "#87CEEB",
    "on-surface-variant": "#E6F3FF",
    primary: "#87CEEB",
    "primary-darken-1": "#78BAD6",
    secondary: "#B0E0E6",
    "secondary-darken-1": "#A0D0D6",
    error: "#4169E1",
    info: "#00BFFF",
    success: "#AFEEEE",
    warning: "#7B68EE",
  },
  dark: {
    background: "#0A2F35",
    surface: "#1A3F45",
    "surface-bright": "#2A4F55",
    "surface-light": "#14373D",
    "surface-variant": "#E0FFFF",
    "on-surface-variant": "#0A2F35",
    primary: "#E0FFFF",
    "primary-darken-1": "#D0EFEF",
    secondary: "#F0FFFF",
    "secondary-darken-1": "#E0EFEF",
    error: "#6495ED",
    info: "#40E0D0",
    success: "#B0F0F0",
    warning: "#9370DB",
  },
};
export default { palette };
