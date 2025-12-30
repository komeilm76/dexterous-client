import vuetifyTheme from "@/micro-service/services/palette/dist/vuetify-theme.json";
/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import type { App } from "vue";

const install = async (app: App<Element>) => {
  const instance = createVuetify({
    theme: {
      defaultTheme: "system",
      themes: vuetifyTheme,
    },
  });
  app.use(instance);
};

export default { install };
