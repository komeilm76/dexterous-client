import type { IPalette } from "../types";

// Chroma Theme
const palette: IPalette = {
  light: {
    background: "#FFE8D6",
    surface: "#F7D7C4",
    "surface-bright": "#FFF4EB",
    "surface-light": "#E8C8B5",
    "surface-variant": "#6D6875",
    "on-surface-variant": "#FFE8D6",
    primary: "#6D6875",
    "primary-darken-1": "#5D5865",
    secondary: "#B5838D",
    "secondary-darken-1": "#A5737D",
    error: "#E5989B",
    info: "#83C5BE",
    success: "#A5A58D",
    warning: "#FFB4A2",
  },
  dark: {
    background: "#2D2A32",
    surface: "#3D3A42",
    "surface-bright": "#4D4A52",
    "surface-light": "#35323A",
    "surface-variant": "#E8C8B5",
    "on-surface-variant": "#2D2A32",
    primary: "#E8C8B5",
    "primary-darken-1": "#D8B8A5",
    secondary: "#D6A3AD",
    "secondary-darken-1": "#C6939D",
    error: "#F5B8BB",
    info: "#A3D5CE",
    success: "#C5C5AD",
    warning: "#FFD4C2",
  },
};
export default { palette };
