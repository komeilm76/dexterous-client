import generator from "./generator";

const config = generator.makeHead([
  {
    name: "meta",
    attrs: { charset: "utf-8" },
  },
  {
    name: "link",
    attrs: {
      rel: "icon",
      href: "/pwa/favicon.ico",
    },
  },
  {
    name: "meta",
    attrs: {
      name: "viewport",
      content: "width=device-width, initial-scale=1.0",
    },
  },
  {
    name: "title",
    content: "Welcome To Dexterous",
  },
  {
    name: "link",
    attrs: { rel: "manifest", href: "./public/pwa/manifest.json" },
  },
  {
    name: "link",
    attrs: {
      rel: "apple-touch-icon",
      sizes: "180x180",
      href: "/pwa/icons/icon-180x180.png",
    },
  },
]);

export default config;
