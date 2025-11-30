import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#F5F5F5",
    surface: "#E8E8E8",
    "surface-bright": "#FFFFFF",
    "surface-light": "#D8D8D8",
    "surface-variant": "#696969",
    "on-surface-variant": "#F5F5F5",
    primary: "#505050",
    "primary-darken-1": "#404040",
    secondary: "#808080",
    "secondary-darken-1": "#707070",
    error: "#8B4513",
    info: "#4682B4",
    success: "#556B2F",
    warning: "#D2691E",
  },
  dark: {
    background: "#1C1C1C",
    surface: "#2F2F2F",
    "surface-bright": "#3D3D3D",
    "surface-light": "#262626",
    "surface-variant": "#A9A9A9",
    "on-surface-variant": "#1C1C1C",
    primary: "#A9A9A9",
    "primary-darken-1": "#999999",
    secondary: "#696969",
    "secondary-darken-1": "#595959",
    error: "#CD853F",
    info: "#5F9EA0",
    success: "#6B8E23",
    warning: "#DEB887",
  },
};
export default { palette };
