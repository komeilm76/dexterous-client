import type { IPaletteType } from "@/stores/application/setting/palette/types";

const importCSSFiles = async (
  entryOptions: Partial<Record<IPaletteType, boolean>>
) => {
  const options: Record<IPaletteType, boolean> = {
    default: true,
    pastel: false,
    wood: false,
    neo: false,
    chroma: false,
    bumbleBee: false,
    ocean: false,
    ston: false,
    neon: false,
    spring: false,
    winter: false,
    fall: false,
    summer: false,
    water: false,
    hell: false,
    heaven: false,
    sunrise: false,
    moon: false,
    office: false,
    sport: false,
    company: false,
    jungle: false,
    food: false,
    coffee: false,
    cyberpunk: false,
    galaxy: false,
    retro: false,
    minimal: false,
    ...entryOptions,
  };

  if (options.default) {
    await import("./palettes/default.css");
  }
  if (options.pastel) {
    await import("./palettes/pastel.css");
  }
  if (options.wood) {
    await import("./palettes/wood.css");
  }
  if (options.neo) {
    await import("./palettes/neo.css");
  }
  if (options.chroma) {
    await import("./palettes/chroma.css");
  }
  if (options.bumbleBee) {
    await import("./palettes/bumbleBee.css");
  }
  if (options.ocean) {
    await import("./palettes/ocean.css");
  }
  if (options.ston) {
    await import("./palettes/ston.css");
  }
  if (options.neon) {
    await import("./palettes/neon.css");
  }
  if (options.spring) {
    await import("./palettes/spring.css");
  }
  if (options.winter) {
    await import("./palettes/winter.css");
  }
  if (options.fall) {
    await import("./palettes/fall.css");
  }
  if (options.summer) {
    await import("./palettes/summer.css");
  }
  if (options.water) {
    await import("./palettes/water.css");
  }
  if (options.hell) {
    await import("./palettes/hell.css");
  }
  if (options.heaven) {
    await import("./palettes/heaven.css");
  }
  if (options.sunrise) {
    await import("./palettes/sunrise.css");
  }
  if (options.moon) {
    await import("./palettes/moon.css");
  }
  if (options.office) {
    await import("./palettes/office.css");
  }
  if (options.sport) {
    await import("./palettes/sport.css");
  }
  if (options.company) {
    await import("./palettes/company.css");
  }
  if (options.jungle) {
    await import("./palettes/jungle.css");
  }
  if (options.food) {
    await import("./palettes/food.css");
  }
  if (options.coffee) {
    await import("./palettes/coffee.css");
  }
  if (options.cyberpunk) {
    await import("./palettes/cyberpunk.css");
  }
  if (options.galaxy) {
    await import("./palettes/galaxy.css");
  }
  if (options.retro) {
    await import("./palettes/retro.css");
  }
  if (options.minimal) {
    await import("./palettes/minimal.css");
  }
};
