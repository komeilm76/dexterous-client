import type { IPalette } from "../types";

// Chroma Theme
const palette: IPalette = {
  light: {
    background: "#000000",
    surface: "#0A0A0A",
    "surface-bright": "#1A1A1A",
    "surface-light": "#141414",
    "surface-variant": "#00FFFF",
    "on-surface-variant": "#000000",
    primary: "#FF00FF",
    "primary-darken-1": "#E600E6",
    secondary: "#00FFFF",
    "secondary-darken-1": "#00E6E6",
    error: "#FF0000",
    info: "#0000FF",
    success: "#00FF00",
    warning: "#FFFF00",
  },
  dark: {
    background: "#000000",
    surface: "#0A0A0A",
    "surface-bright": "#1A1A1A",
    "surface-light": "#141414",
    "surface-variant": "#FF00FF",
    "on-surface-variant": "#000000",
    primary: "#00FFFF",
    "primary-darken-1": "#00E6E6",
    secondary: "#FF00FF",
    "secondary-darken-1": "#E600E6",
    error: "#FF4444",
    info: "#4444FF",
    success: "#44FF44",
    warning: "#FFFF44",
  },
};
export default { palette };
