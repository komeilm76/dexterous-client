import type { IThemeMode, IThemeModeType } from "./types";

const themeModeList: IThemeMode[] = [
  { key: "dark", name: "Dark" },
  { key: "light", name: "Light" },
  { key: "system", name: "System" },
];
const defaultThemeMode: IThemeModeType =
  import.meta.env.VITE_APP_SETTING_DEFAULT_THEME_MODE || "system";
export default { themeModeList, defaultThemeMode };
