import type { IPaletteType } from "@/micro-modules/palette/palette-types";
import type { IThemeModeType } from "@/stores/application/setting/theme/types";
import type { Colors } from "vuetify/lib/composables/theme.mjs";

export type IPaletteNames = `${IPaletteType}-${Exclude<
  IThemeModeType,
  "system"
>}`;

export type IPalette = Record<
  Exclude<IThemeModeType, "system">,
  Partial<Colors>
>;
