import type { IThemeMode, IThemeModeType } from "./types";

const themeModeList: IThemeMode[] = [
  { key: "dark", name: "Dark" },
  { key: "light", name: "Light" },
  { key: "system", name: "System" },
];
const defaultThemeMode: IThemeModeType = "system";
export default { themeModeList, defaultThemeMode };
