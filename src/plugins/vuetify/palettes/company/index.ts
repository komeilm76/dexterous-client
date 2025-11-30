import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#FFFFFF",
    surface: "#F8F9FA",
    "surface-bright": "#FFFFFF",
    "surface-light": "#E9ECEF",
    "surface-variant": "#495057",
    "on-surface-variant": "#F8F9FA",
    primary: "#007BFF",
    "primary-darken-1": "#0069D9",
    secondary: "#6C757D",
    "secondary-darken-1": "#5A6268",
    error: "#DC3545",
    info: "#17A2B8",
    success: "#28A745",
    warning: "#FFC107",
  },
  dark: {
    background: "#121416",
    surface: "#1E2125",
    "surface-bright": "#2A2E33",
    "surface-light": "#181A1D",
    "surface-variant": "#ADB5BD",
    "on-surface-variant": "#121416",
    primary: "#4DABF7",
    "primary-darken-1": "#3D9BE7",
    secondary: "#868E96",
    "secondary-darken-1": "#767E86",
    error: "#EA868F",
    info: "#3DEDF7",
    success: "#51CF66",
    warning: "#FFD43B",
  },
};
export default { palette };
