import type { IFont, IFontType } from "./types";
const fontList: IFont[] = [
  { key: "Roboto", name: "Roboto" },
  { key: "Beiruti", name: "Beiruti" },
  { key: "Noto Nastaliq Urdu", name: "Noto Nastaliq Urdu" },
  { key: "Gulzar", name: "Gulzar" },
  { key: "Lalezar", name: "Lalezar" },
  { key: "Caveat", name: "Caveat" },
];
const defaultFont: IFontType = import.meta.env.VITE_APP_SETTING_DEFAULT_FONT;
export default { fontList, defaultFont };
