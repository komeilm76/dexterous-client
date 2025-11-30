import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#2C0000",
    surface: "#3D0000",
    "surface-bright": "#4D0000",
    "surface-light": "#260000",
    "surface-variant": "#FF4500",
    "on-surface-variant": "#2C0000",
    primary: "#FF4500",
    "primary-darken-1": "#E63D00",
    secondary: "#DC143C",
    "secondary-darken-1": "#C91434",
    error: "#FF0000",
    info: "#8B0000",
    success: "#800000",
    warning: "#FF8C00",
  },
  dark: {
    background: "#0A0000",
    surface: "#1A0000",
    "surface-bright": "#2A0000",
    "surface-light": "#140000",
    "surface-variant": "#FF6B6B",
    "on-surface-variant": "#0A0000",
    primary: "#FF6B6B",
    "primary-darken-1": "#E85B5B",
    secondary: "#FF4757",
    "secondary-darken-1": "#E83747",
    error: "#FF4444",
    info: "#CD5C5C",
    success: "#B22222",
    warning: "#FFA07A",
  },
};
export default { palette };
