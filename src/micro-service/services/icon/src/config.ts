import { kmIcon } from "km-icon";

const config = kmIcon.fontawesome.makeConfig({
  brands: true,
  familyGroup: {
    classic: true,
    duotone: true,
    sharp: false,
    "sharp-duotone": false,
    chisel: false,
    etch: false,
    jelly: false,
    notdog: false,
    slab: false,
    thumbprint: false,
    utility: false,
    whiteboard: false,
  },
  weight: {
    solid: true,
    regular: false,
    light: false,
    thin: false,
  },
});

export default config;
