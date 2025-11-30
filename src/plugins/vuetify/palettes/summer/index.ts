import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#FFFACD",
    surface: "#FFFAF0",
    "surface-bright": "#FFFFFF",
    "surface-light": "#FFF8DC",
    "surface-variant": "#48D1CC",
    "on-surface-variant": "#FFFACD",
    primary: "#FF6347",
    "primary-darken-1": "#E6553A",
    secondary: "#48D1CC",
    "secondary-darken-1": "#3BC2BD",
    error: "#DC143C",
    info: "#00CED1",
    success: "#3CB371",
    warning: "#FFD700",
  },
  dark: {
    background: "#1A2F2F",
    surface: "#253F3F",
    "surface-bright": "#305050",
    "surface-light": "#1F3535",
    "surface-variant": "#FF6347",
    "on-surface-variant": "#1A2F2F",
    primary: "#48D1CC",
    "primary-darken-1": "#3BC2BD",
    secondary: "#FF6347",
    "secondary-darken-1": "#E6553A",
    error: "#FF6B8B",
    info: "#20B2AA",
    success: "#66CDAA",
    warning: "#FFEC8B",
  },
};
export default { palette };
