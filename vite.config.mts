// Plugins
import Components from "unplugin-vue-components/vite";
import Vue from "@vitejs/plugin-vue";
import Vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import Fonts from "unplugin-fonts/vite";
import VueRouter from "unplugin-vue-router/vite";
import vueDevTools from "vite-plugin-vue-devtools";
// Utilities
import { defineConfig } from "vite";
import { fileURLToPath, URL } from "node:url";
// plugins
import tailwindcss from "@tailwindcss/vite";

// import mkcert from "vite-plugin-mkcert";
// import { useManifest } from "km-manifest";
// const m = useManifest();

// m.makeManifest({
//   name: "Dexterous Client",
//   short_name: "Dexterous Client",
//   icons: [
//     {
//       src: "/src/assets/media/pwa/logo.png",
//       type: "image/png",
//       sizes: "1024x1024",
//     },
//   ],
//   screenshots: [
//     {
//       src: "/src/assets/media/pwa/Screenshot-376x320.png",
//       sizes: "376x320",
//       form_factor: "wide",
//       type: "image/png",
//     },
//     {
//       src: "/src/assets/media/pwa/screencapture-1170x2532_1.png",
//       sizes: "1170x2532",
//       form_factor: "narrow",
//       type: "image/png",
//     },
//     {
//       src: "/src/assets/media/pwa/screencapture-1170x2532_2.png",
//       sizes: "1170x2532",
//       form_factor: "narrow",
//       type: "image/png",
//     },
//     {
//       src: "/src/assets/media/pwa/screencapture-1170x2532_3.png",
//       sizes: "1170x2532",
//       form_factor: "narrow",
//       type: "image/png",
//     },
//   ],
//   background_color: "#078af7",
//   theme_color: "#078af7",
//   description: "Dexterous Client Application",
//   id: "/?source=pwa",
//   start_url: "/?source=pwa",
//   display: "standalone",
//   scope: "/",
//   launch_handler: {
//     client_mode: "focus-existing",
//   },
// }).jsonFile({ path: "/src/pwa/config" });
// https://vitejs.dev/config/

export default defineConfig({
  plugins: [
    // mkcert({
    //   // hosts: ["viteAppTest.net"],
    //   // mkcertPath: "certs",
    //   // certFileName: "certs",
    //   // keyFileName: "key",
    //   autoUpgrade: true,
    //   savePath: "certs",
    //   source: "github",
    //   force: true,
    // }),
    VueRouter({
      dts: "src/typed-router.d.ts",
    }),
    Vue({
      template: { transformAssetUrls },
    }),
    // https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin#readme
    Vuetify({
      autoImport: true,
      styles: {
        // configFile: "src/styles/settings.scss",
        configFile: "src/plugins/vuetify/style.setting.scss",
      },
    }),
    Components({
      dts: "src/components.d.ts",
    }),
    Fonts({
      fontsource: {
        families: [
          // {
          //   name: "Roboto",
          //   weights: [100, 300, 400, 500, 700, 900],
          //   styles: ["normal", "italic"],
          // },
          // Language: ['en','fa']
          {
            name: "Beiruti",
            weights: [200, 300, 400, 500, 600, 700, 800, 900],
            styles: ["normal"],
          },
          // Language: ['fa']
          // {
          //   name: "Noto Nastaliq Urdu",
          //   weights: [400],
          //   styles: ["normal"],
          // },
          // Language: ['fa']
          // {
          //   name: "Gulzar",
          //   weights: [400],
          //   styles: ["normal"],
          // },
          // Language: ['fa']
          // {
          //   name: "Lalezar",
          //   weights: [400],
          //   styles: ["normal"],
          // },
          // {
          //   name: "Caveat",
          //   weights: [400, 500, 600, 700],
          //   styles: ["normal"],
          // },
        ],
      },
    }),
    vueDevTools(),
    tailwindcss(),
  ],
  optimizeDeps: {
    exclude: [
      "vuetify",
      "vue-router",
      "unplugin-vue-router/runtime",
      "unplugin-vue-router/data-loaders",
      "unplugin-vue-router/data-loaders/basic",
    ],
  },
  define: { "process.env": {} },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("src", import.meta.url)),
    },
    extensions: [".js", ".json", ".jsx", ".mjs", ".ts", ".tsx", ".vue"],
  },
  // server: {
  //   port: 3000,
  // },
});
