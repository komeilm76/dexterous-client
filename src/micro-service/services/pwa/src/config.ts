import type { IConfig } from "./schemas";
const config: IConfig = {
  manifest: {
    name: "Dexterous Client",
    short_name: "Dexterous Client",
    // @ts-ignore
    icons: [],
    // @ts-ignore
    screenshots: [],
    background_color: "#078af7",
    theme_color: "#078af7",
    description: "Dexterous Client Application",
    id: "/?source=pwa",
    start_url: "/?source=pwa",
    display: "standalone",
    scope: "/",
    launch_handler: {
      client_mode: "focus-existing",
    },
    file_handlers: [],
    orientation: "any",
    display_override: [],
    dir: "ltr",
    lang: "",
    publicPath: "",
    related_applications: [],
    prefer_related_applications: false,
    protocol_handlers: [],
    shortcuts: [],
    categories: [],
    iarc_rating_id: "",
    scope_extensions: [],
  },
  iconSizes: [16, 32, 48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512, 1024],
};

export default config;
