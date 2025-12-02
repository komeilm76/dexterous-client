import type kmIcon from "km-icon";
import type kmManifest from "km-manifest";
import type kmPalette from "km-palette";

type IPaletteType = kmPalette.Type;
type IPaletteMode = kmPalette.Mode;
type IPaletteColor = kmPalette.Color;
export type IPaletteTakeGeneric = [IPaletteType, IPaletteColor, IPaletteMode];
export type IPaletteMakeGeneric = [
  "YES",
  IPaletteType,
  IPaletteColor,
  IPaletteMode
];
type IThemeModeType = "dark" | "light" | "system";
type IFontType =
  | "Roboto"
  | "Beiruti"
  | "Noto Nastaliq Urdu"
  | "Gulzar"
  | "Lalezar"
  | "Caveat";
type ILanguageType = "en" | "fa";
export type IMicroserviceConfig = {
  fonts: Record<IFontType, boolean>;
  iconFonts: {
    fontawesome: kmIcon.iFontawesomeConfig;
  };
  theme: {
    paletteTypes: Record<IPaletteType, boolean>;
    paletteModes: Record<IPaletteMode, boolean>;
    paletteColors: Record<IPaletteColor, boolean>;
    themeModes: Record<IThemeModeType, boolean>;
  };
  languages: Record<ILanguageType, boolean>;
  manifest: Partial<kmManifest.IManifestConfig<kmManifest.IDefaultMimeType>> &
    Pick<
      kmManifest.IManifestConfig<kmManifest.IDefaultMimeType>,
      "name" | "start_url" | "display" | "icons" | "screenshots"
    >;
};
