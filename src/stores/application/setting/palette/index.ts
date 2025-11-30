import type { IPalette, IPaletteType } from "./types";

import paletteList from "@/micro/palette/dist/palette-list.json";

const defaultPalette = import.meta.env.VITE_APP_SETTING_DEFAULT_PALETTE;
export default { paletteList, defaultPalette };
