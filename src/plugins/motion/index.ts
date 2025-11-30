import { MotionPlugin } from "@vueuse/motion";
import type { App } from "vue";

const install = (app: App<Element>) => {
  app.use(MotionPlugin);
};

export default { install };
