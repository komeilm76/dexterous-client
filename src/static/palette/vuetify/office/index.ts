import type { IPalette } from "../types";

const palette: IPalette = {
  light: {
    background: "#FFFFFF",
    surface: "#F5F5F5",
    "surface-bright": "#FFFFFF",
    "surface-light": "#E8E8E8",
    "surface-variant": "#2C5F9E",
    "on-surface-variant": "#F5F5F5",
    primary: "#2C5F9E",
    "primary-darken-1": "#25508E",
    secondary: "#5F9EA0",
    "secondary-darken-1": "#4F8E90",
    error: "#8B0000",
    info: "#4682B4",
    success: "#2E8B57",
    warning: "#DAA520",
  },
  dark: {
    background: "#0A1A2F",
    surface: "#1A2A3F",
    "surface-bright": "#2A3A4F",
    "surface-light": "#142235",
    "surface-variant": "#7EB6FF",
    "on-surface-variant": "#0A1A2F",
    primary: "#7EB6FF",
    "primary-darken-1": "#6EA6EF",
    secondary: "#8FD0D2",
    "secondary-darken-1": "#7FC0C2",
    error: "#CD5C5C",
    info: "#6A9FCF",
    success: "#5EAB7F",
    warning: "#E8C54F",
  },
};
export default { palette };
