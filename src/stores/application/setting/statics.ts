import font from "./font";
import type { IFont, IFontType } from "./font/types";
import language from "./language";
import type { ILanguage, ILanguageType } from "./language/types";
import palette from "./palette";
import type { IPalette } from "./palette/types";
import theme from "./theme";
import type { IThemeMode } from "./theme/types";

type IAppStatics = {
  fontList: IFont[];
  languageList: ILanguage[];
  themeModeList: IThemeMode[];
  paletteList: IPalette[];
};
const config: IAppStatics = {
  fontList: font.fontList,
  languageList: language.languageList,
  themeModeList: theme.themeModeList,
  paletteList: palette.paletteList,
};

export default { config };
