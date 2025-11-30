import type { IPalette } from "../types";

// Chroma Theme
const palette: IPalette = {
  light: {
    background: "#FFFFFF",
    surface: "#F8F9FA",
    "surface-bright": "#FFFFFF",
    "surface-light": "#E9ECEF",
    "surface-variant": "#212529",
    "on-surface-variant": "#F8F9FA",
    primary: "#212529",
    "primary-darken-1": "#111519",
    secondary: "#495057",
    "secondary-darken-1": "#394047",
    error: "#6C757D",
    info: "#ADB5BD",
    success: "#CED4DA",
    warning: "#DEE2E6",
  },
  dark: {
    background: "#000000",
    surface: "#0A0A0A",
    "surface-bright": "#1A1A1A",
    "surface-light": "#050505",
    "surface-variant": "#FFFFFF",
    "on-surface-variant": "#000000",
    primary: "#FFFFFF",
    "primary-darken-1": "#F0F0F0",
    secondary: "#E9ECEF",
    "secondary-darken-1": "#D9DCE0",
    error: "#6C757D",
    info: "#ADB5BD",
    success: "#CED4DA",
    warning: "#DEE2E6",
  },
};
export default { palette };
