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

const app = createApp(App);
await plugins.icon.install();
plugins.router.install(app);
plugins.pinia.install(app);
await plugins.tailwind.install();
plugins.vuetify.install(app);
plugins.motion.install(app);
app.mount("#app");
