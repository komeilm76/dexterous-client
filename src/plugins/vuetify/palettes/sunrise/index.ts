import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#FFF5E6",
    surface: "#FFE8CC",
    "surface-bright": "#FFF9F0",
    "surface-light": "#FFDAB9",
    "surface-variant": "#FF4500",
    "on-surface-variant": "#FFF5E6",
    primary: "#FF4500",
    "primary-darken-1": "#E63D00",
    secondary: "#FF8C00",
    "secondary-darken-1": "#E67C00",
    error: "#DC143C",
    info: "#FFD700",
    success: "#32CD32",
    warning: "#FF6347",
  },
  dark: {
    background: "#2E1B0E",
    surface: "#3D2815",
    "surface-bright": "#4D351C",
    "surface-light": "#36200F",
    "surface-variant": "#FFA07A",
    "on-surface-variant": "#2E1B0E",
    primary: "#FFA07A",
    "primary-darken-1": "#E8906A",
    secondary: "#FFB366",
    "secondary-darken-1": "#E8A356",
    error: "#FF6B8B",
    info: "#FFEC8B",
    success: "#7CFC7C",
    warning: "#FF8A65",
  },
};

export default { palette };
