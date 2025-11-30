import type { IPaletteType } from "@/stores/application/setting/palette/types";

const install = async () => {
  await import("./theme.css");
};

export default { install };
