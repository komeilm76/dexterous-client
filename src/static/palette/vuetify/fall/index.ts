import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#FFF5E6",
    surface: "#FFE8CC",
    "surface-bright": "#FFF9F0",
    "surface-light": "#FFDAB9",
    "surface-variant": "#8B4513",
    "on-surface-variant": "#FFF5E6",
    primary: "#D2691E",
    "primary-darken-1": "#B35917",
    secondary: "#A0522D",
    "secondary-darken-1": "#8B4513",
    error: "#8B0000",
    info: "#CD853F",
    success: "#8FBC8F",
    warning: "#FF8C00",
  },
  dark: {
    background: "#2E1B0E",
    surface: "#3D2815",
    "surface-bright": "#4D351C",
    "surface-light": "#36200F",
    "surface-variant": "#DEB887",
    "on-surface-variant": "#2E1B0E",
    primary: "#DEB887",
    "primary-darken-1": "#CDA777",
    secondary: "#CD853F",
    "secondary-darken-1": "#BC7537",
    error: "#CD5C5C",
    info: "#D2B48C",
    success: "#9BCD9B",
    warning: "#FFA54F",
  },
};
export default { palette };
