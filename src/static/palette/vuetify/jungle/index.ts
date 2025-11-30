import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#F0FFF0",
    surface: "#E8F5E8",
    "surface-bright": "#F8FFF8",
    "surface-light": "#D4EBD4",
    "surface-variant": "#228B22",
    "on-surface-variant": "#F0FFF0",
    primary: "#228B22",
    "primary-darken-1": "#1C7A1C",
    secondary: "#32CD32",
    "secondary-darken-1": "#2CBD2C",
    error: "#8B0000",
    info: "#20B2AA",
    success: "#006400",
    warning: "#9ACD32",
  },
  dark: {
    background: "#0A2A0A",
    surface: "#1A3A1A",
    "surface-bright": "#2A4A2A",
    "surface-light": "#143214",
    "surface-variant": "#90EE90",
    "on-surface-variant": "#0A2A0A",
    primary: "#90EE90",
    "primary-darken-1": "#80DE80",
    secondary: "#7CFC7C",
    "secondary-darken-1": "#6CEC6C",
    error: "#CD5C5C",
    info: "#48D1CC",
    success: "#32CD32",
    warning: "#ADFF2F",
  },
};
export default { palette };
