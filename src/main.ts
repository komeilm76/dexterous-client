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

import { loadEnvs } from "./composables/env";

const runApplicatio = async () => {
  const envs = await loadEnvs();
  const app = createApp(App);
  app.provide("envs", envs);
  plugins.pinia.install(app);
  plugins.router.install(app);
  await plugins.tailwind.install();
  plugins.vuetify.install(app);
  plugins.motion.install(app);
  await plugins.icon.install();
  app.mount("#app");
};

await runApplicatio();
