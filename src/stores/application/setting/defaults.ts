import font from "./font";
import type { IFont, IFontType } from "./font/types";
import language from "./language";
import type { ILanguage, ILanguageType } from "./language/types";
import palette from "./palette";
import type { IPalette } from "./palette/types";
import type { IPaletteType } from "@/micro-modules/palette/palette-types";

import theme from "./theme";
import type { IThemeModeType } from "./theme/types";

type IAppDefaults = {
  language: ILanguageType;
  font: IFontType;
  themeMode: IThemeModeType;
  palette: IPaletteType;
};
const config: IAppDefaults = {
  language: language.defaultLanguage,
  font: font.defaultFont,
  themeMode: theme.defaultThemeMode,
  palette: palette.defaultPalette,
};

export default { config };
