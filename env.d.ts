/// <reference types="vite/client" />
/// <reference types="unplugin-vue-router/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_BUILD_HASH: string;
  readonly VITE_APP_SETTING_DEFAULT_LANGUAGE: import("@/stores/application/setting/language/types").ILanguageType;
  readonly VITE_APP_SETTING_DEFAULT_FONT: import("@/stores/application/setting/font/types").IFontType;
  readonly VITE_APP_SETTING_DEFAULT_THEME_MODE: import("@/stores/application/setting/theme/types").IThemeModeType;
  readonly VITE_APP_SETTING_DEFAULT_PALETTE: import("@/stores/application/setting/palette/types").IPaletteType;
  readonly VITE_APP_PINIA_PERSISTED_PREFIX: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
