/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import plugins from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";

// Styles
import "unfonts.css";
import "km-icon/assets/fontawesome/v7/pro/imports/fontawesome.css";
import "km-icon/assets/fontawesome/v7/pro/imports/all-family.css";
import "km-icon/assets/fontawesome/v7/pro/imports/all-weight.css";
import type { IPaletteType } from "./stores/application/setting/palette/types";

const app = createApp(App);

const palettes: Partial<Record<IPaletteType, boolean>> = {
  bumbleBee: true,
  chroma: true,
};

plugins.router.install(app);
plugins.pinia.install(app);
await plugins.tailwind.install();
plugins.vuetify.install(app);
plugins.motion.install(app);
app.mount("#app");
