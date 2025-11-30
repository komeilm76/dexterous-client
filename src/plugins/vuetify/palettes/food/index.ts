import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#FFF5F5",
    surface: "#FFE8E8",
    "surface-bright": "#FFF0F0",
    "surface-light": "#FFDADA",
    "surface-variant": "#FF6B6B",
    "on-surface-variant": "#FFF5F5",
    primary: "#FF6B6B",
    "primary-darken-1": "#E65555",
    secondary: "#4ECDC4",
    "secondary-darken-1": "#45B8B0",
    error: "#FF4757",
    info: "#70D6FF",
    success: "#51E898",
    warning: "#FFD166",
  },
  dark: {
    background: "#2D1B1B",
    surface: "#3D2828",
    "surface-bright": "#4D3535",
    "surface-light": "#352020",
    "surface-variant": "#FF8E8E",
    "on-surface-variant": "#2D1B1B",
    primary: "#FF8E8E",
    "primary-darken-1": "#E87E7E",
    secondary: "#6ED6CD",
    "secondary-darken-1": "#5EC2B9",
    error: "#FF6B7A",
    info: "#8AE2FF",
    success: "#71F4A8",
    warning: "#FFDD8B",
  },
};
export default { palette };
