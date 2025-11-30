export type ILanguageType = "fa" | "en";
export type ILanguageShape = {
  common: {
    contrent: string;
    language: {
      persian: string;
      engilsh: string;
    };
  };
  pages: {
    dashboard: {
      title: string;
    };
  };
};
export type ILanguage = {
  key: ILanguageType;
  name: string;
  dir: "rtl" | "ltr";
};
