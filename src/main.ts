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
import tools from "./tools";

const runApplication = async () => {
  const envs = await loadEnvs();
  const app = createApp(App);
  app.provide("envs", envs);
  plugins.vuetify.install(app);
  await tools.time.wait(100);
  plugins.pinia.install(app);
  await tools.time.wait(100);
  plugins.router.install(app);
  plugins.motion.install(app);
  await tools.time.wait(100);
  await plugins.icon.install();
  await plugins.tailwind.install();
  app.mount("#app");
  // await plugins.serviceWorker.install(envs, app);
};

await runApplication();