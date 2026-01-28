import type { IPalette } from "./types";

import paletteList from "@/micro-modules/palette/palette-list.json";
const defaultPalette = import.meta.env.VITE_APP_SETTING_DEFAULT_PALETTE;
export default {
  paletteList: paletteList as IPalette[],
  defaultPalette,
};
