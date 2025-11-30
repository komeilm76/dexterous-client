import i18n from "./i18n";
import type { ILanguage, ILanguageShape, ILanguageType } from "./types";
const languageList: ILanguage[] = [
  {
    key: "en",
    name: "English",
    dir: "ltr",
  },
  {
    key: "fa",
    name: "فارسی",
    dir: "rtl",
  },
];
const defaultLanguage: ILanguageType = import.meta.env.VITE_APP_SETTING_DEFAULT_LANGUAGE;
export default { defaultLanguage, languageList };
