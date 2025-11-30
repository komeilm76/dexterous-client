export type IPaletteType =
  | "default"
  | "pastel"
  | "wood"
  | "neo"
  | "chroma"
  | "bumbleBee"
  | "ocean"
  | "ston"
  | "neon"
  | "spring"
  | "winter"
  | "fall"
  | "summer"
  | "water"
  | "hell"
  | "heaven"
  | "sunrise"
  | "moon"
  | "office"
  | "sport"
  | "company"
  | "jungle"
  | "food"
  | "coffee"
  | "cyberpunk"
  | "galaxy"
  | "retro"
  | "minimal";
export type IPalette = {
  key: IPaletteType;
  name: string;
};
