import type { IPalette } from "../types";

// Chroma Theme
const palette: IPalette = {
  light: {
    background: "#1A0033",
    surface: "#2A0044",
    "surface-bright": "#3A0055",
    "surface-light": "#200033",
    "surface-variant": "#9370DB",
    "on-surface-variant": "#1A0033",
    primary: "#9370DB",
    "primary-darken-1": "#8360CB",
    secondary: "#BA55D3",
    "secondary-darken-1": "#AA45C3",
    error: "#FF69B4",
    info: "#4B0082",
    success: "#483D8B",
    warning: "#DA70D6",
  },
  dark: {
    background: "#000011",
    surface: "#100022",
    "surface-bright": "#200033",
    "surface-light": "#080019",
    "surface-variant": "#E6E6FA",
    "on-surface-variant": "#000011",
    primary: "#E6E6FA",
    "primary-darken-1": "#D6D6EA",
    secondary: "#D8BFD8",
    "secondary-darken-1": "#C8AFD8",
    error: "#FFB6C1",
    info: "#8A2BE2",
    success: "#6A5ACD",
    warning: "#EE82EE",
  },
};
export default { palette };
