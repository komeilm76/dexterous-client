export type IFontType =
  | "Roboto"
  | "Beiruti"
  | "Noto Nastaliq Urdu"
  | "Gulzar"
  | "Lalezar"
  | "Caveat";

export type IFont = {
  key: IFontType;
  name: string;
};
