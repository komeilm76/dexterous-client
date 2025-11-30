import type { IPalette } from "../types";

// Chroma Theme
const palette: IPalette = {
  light: {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    "surface-bright": "#2A2A2A",
    "surface-light": "#141414",
    "surface-variant": "#00FFFF",
    "on-surface-variant": "#0A0A0A",
    primary: "#FF00FF",
    "primary-darken-1": "#E600E6",
    secondary: "#00FFFF",
    "secondary-darken-1": "#00E6E6",
    error: "#FF0033",
    info: "#00FFCC",
    success: "#00FF00",
    warning: "#FFFF00",
  },
  dark: {
    background: "#000000",
    surface: "#0F0F0F",
    "surface-bright": "#1F1F1F",
    "surface-light": "#0A0A0A",
    "surface-variant": "#FF00FF",
    "on-surface-variant": "#000000",
    primary: "#00FFFF",
    "primary-darken-1": "#00E6E6",
    secondary: "#FF00FF",
    "secondary-darken-1": "#E600E6",
    error: "#FF3366",
    info: "#33FFDD",
    success: "#33FF33",
    warning: "#FFFF33",
  },
};
export default { palette };
