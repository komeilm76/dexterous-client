import type { IPalette } from "../types";

// Chroma Theme
const palette: IPalette = {
  light: {
    background: "#FFFF00",
    surface: "#FFEF00",
    "surface-bright": "#FFFF4D",
    "surface-light": "#FFE600",
    "surface-variant": "#000000",
    "on-surface-variant": "#FFFF00",
    primary: "#000000",
    "primary-darken-1": "#000000",
    secondary: "#FFA500",
    "secondary-darken-1": "#E69500",
    error: "#FF0000",
    info: "#0000FF",
    success: "#008000",
    warning: "#FF8C00",
  },
  dark: {
    background: "#000000",
    surface: "#1A1A00",
    "surface-bright": "#2A2A00",
    "surface-light": "#141400",
    "surface-variant": "#FFFF00",
    "on-surface-variant": "#000000",
    primary: "#FFFF00",
    "primary-darken-1": "#E6E600",
    secondary: "#FFA500",
    "secondary-darken-1": "#E69500",
    error: "#FF4444",
    info: "#4444FF",
    success: "#44CC44",
    warning: "#FFB833",
  },
};
export default { palette };
