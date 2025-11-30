import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#FFF8F0",
    surface: "#FFFAF5",
    "surface-bright": "#FFFFFF",
    "surface-light": "#FFF0E0",
    "surface-variant": "#87CEEB",
    "on-surface-variant": "#FFFFFF",
    primary: "#FF69B4",
    "primary-darken-1": "#E6559D",
    secondary: "#98FB98",
    "secondary-darken-1": "#85E085",
    error: "#FF6B6B",
    info: "#87CEEB",
    success: "#32CD32",
    warning: "#FFD700",
  },
  dark: {
    background: "#2D1B2E",
    surface: "#3A2942",
    "surface-bright": "#4A3654",
    "surface-light": "#332238",
    "surface-variant": "#FFB6C1",
    "on-surface-variant": "#2D1B2E",
    primary: "#FFB6C1",
    "primary-darken-1": "#E8A5B0",
    secondary: "#C1FFC1",
    "secondary-darken-1": "#ADE8AD",
    error: "#FF8A8A",
    info: "#A3D9FF",
    success: "#7CFC7C",
    warning: "#FFE44D",
  },
};
export default { palette };
