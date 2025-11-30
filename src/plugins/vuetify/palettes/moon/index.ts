import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#F0F0F0",
    surface: "#E8E8E8",
    "surface-bright": "#F8F8F8",
    "surface-light": "#D8D8D8",
    "surface-variant": "#696969",
    "on-surface-variant": "#F0F0F0",
    primary: "#696969",
    "primary-darken-1": "#595959",
    secondary: "#A9A9A9",
    "secondary-darken-1": "#999999",
    error: "#8B0000",
    info: "#708090",
    success: "#2F4F4F",
    warning: "#DAA520",
  },
  dark: {
    background: "#0A0A0A",
    surface: "#1A1A1A",
    "surface-bright": "#2A2A2A",
    "surface-light": "#141414",
    "surface-variant": "#C0C0C0",
    "on-surface-variant": "#0A0A0A",
    primary: "#C0C0C0",
    "primary-darken-1": "#B0B0B0",
    secondary: "#E8E8E8",
    "secondary-darken-1": "#D8D8D8",
    error: "#CD5C5C",
    info: "#A9A9A9",
    success: "#708090",
    warning: "#F0E68C",
  },
};
export default { palette };
