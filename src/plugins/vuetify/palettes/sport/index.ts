import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#F8F9FA",
    surface: "#E9ECEF",
    "surface-bright": "#FFFFFF",
    "surface-light": "#DEE2E6",
    "surface-variant": "#E63946",
    "on-surface-variant": "#F8F9FA",
    primary: "#E63946",
    "primary-darken-1": "#D12B38",
    secondary: "#457B9D",
    "secondary-darken-1": "#3C6A8D",
    error: "#D00000",
    info: "#1D3557",
    success: "#2A9D8F",
    warning: "#F4A261",
  },
  dark: {
    background: "#0A1428",
    surface: "#1A2438",
    "surface-bright": "#2A3448",
    "surface-light": "#141E32",
    "surface-variant": "#FF6B7A",
    "on-surface-variant": "#0A1428",
    primary: "#FF6B7A",
    "primary-darken-1": "#E85B6A",
    secondary: "#6A9DC9",
    "secondary-darken-1": "#5A8DB9",
    error: "#FF4757",
    info: "#4D6A9D",
    success: "#5ABDAF",
    warning: "#F8B871",
  },
};
export default { palette };
