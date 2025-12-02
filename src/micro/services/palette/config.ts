import type { IPaletteMakeGeneric, IPaletteTakeGeneric } from "@/configs/micro/types";
import microServiceConfig from "../../../configs/micro";

import kmPalette from "km-palette";
import paletteConfig from "km-palette/assets/config-default-theme.json" with {type:'json'};
const config = kmPalette.take<IPaletteTakeGeneric>(paletteConfig as unknown as  ReturnType<typeof kmPalette.makeConfig<IPaletteMakeGeneric>>, microServiceConfig.theme.paletteTypes);
export default config