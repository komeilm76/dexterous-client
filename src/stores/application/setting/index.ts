import { defineStore } from "pinia";
import { computed, reactive, ref, watch } from "vue";
import type { ILanguage, ILanguageType } from "./language/types";
import language from "./language";
import i18n from "./language/i18n";
import type { IFont, IFontType } from "./font/types";
import font from "./font";
import defaults from "./defaults";
import statics from "./statics";
import { parse, stringify } from "zipson";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import type { IThemeModeType } from "./theme/types";
import theme from "./theme";
import type { IPaletteType } from "./palette/types";
import palette from "./palette";
import { useBroadcastChannel } from "@vueuse/core";

type IAppSettingChanges =
  | { key: "theme-mode"; value: IThemeModeType }
  | { key: "palette"; value: IPaletteType }
  | { key: "font"; value: IFontType }
  | { key: "language"; value: ILanguageType };

export const useAppSetting = defineStore(
  "app_setting",
  () => {
    const _defaults = reactive(defaults.config);
    const _statics = reactive(statics.config);

    // language
    const changeLanguage = (key: ILanguageType) => {
      _defaults.language = key;
    };
    const t = computed(() => {
      return i18n[_defaults.language].translates;
    });
    const currentLanguage = computed(() => {
      return language.languageList.find((item) => {
        return item.key == _defaults.language;
      }) as ILanguage;
    });

    // font
    const changeFont = (key: IFontType) => {
      _defaults.font = key;
    };
    const currentFont = computed(() => {
      return font.fontList.find((item) => {
        return item.key == _defaults.font;
      }) as IFont;
    });

    // themeMode
    const changeThemeMode = (key: IThemeModeType) => {
      _defaults.themeMode = key;
    };
    const currentThemeMode = computed(() => {
      return theme.themeModeList.find(
        (item) => item.key == _defaults.themeMode
      );
    });
    // palette
    const changePalette = (key: IPaletteType) => {
      _defaults.palette = key;
    };
    const currentPalette = computed(() => {
      return palette.paletteList.find((item) => item.key == _defaults.palette);
    });
    //
    const currentTheme = computed(() => {
      const paletteKey = currentPalette.value?.key as IPaletteType;
      const themeModeKey = currentThemeMode.value?.key as IThemeModeType;
      return `${paletteKey}-${themeModeKey}` as const;
    });

    const sideBarMenu = ref(false);

    const { post, data } = useBroadcastChannel<
      IAppSettingChanges,
      IAppSettingChanges
    >({
      name: "change_app_setting",
    });
    watch(data, () => {
      if (data.value.key == "theme-mode") {
        changeThemeMode(data.value.value);
      }
      if (data.value.key == "palette") {
        changePalette(data.value.value);
      }
      if (data.value.key == "font") {
        changeFont(data.value.value);
      }
      if (data.value.key == "language") {
        changeLanguage(data.value.value);
      }
    });
    watch(
      [currentThemeMode, currentPalette, currentFont, currentLanguage],
      ([ntm, np, nf, nl], [otm, op, of, ol]) => {
        if (ntm && ntm.name !== otm?.name) {
          post({ key: "theme-mode", value: ntm.key });
        }
        if (np && np.name !== op?.name) {
          post({ key: "palette", value: np.key });
        }
        if (nf && nf.name !== of.name) {
          post({ key: "font", value: nf.key });
        }
        if (nl && nl.name !== ol.name) {
          post({ key: "language", value: nl.key });
        }
      }
    );

    return {
      sideBarMenu,
      t,
      changeLanguage,
      currentLanguage,
      changeFont,
      currentFont,
      changeThemeMode,
      currentThemeMode,
      changePalette,
      currentPalette,
      currentTheme,
      statics: _statics,
      defaults: _defaults,
    };
  },
  {
    persist: {
      omit: ["sideBarMenu", "statics", "worker"],
      serializer: {
        deserialize: parse,
        serialize: stringify,
      },
    },
  }
);
