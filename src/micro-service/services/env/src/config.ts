import kmTraversal from "km-traversal";
import z from "zod";
import type { IConfig } from "./schema";
import schema from "./schema";
import { v4 } from "uuid";

const config: IConfig = {
  data: {
    $schema: "./schema.json",
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    setting: {
      font: {
        default: "Beiruti",
        fonts: {
          Beiruti: true,
          "Noto Nastaliq Urdu": true,
          Caveat: true,
          Gulzar: true,
          Lalezar: true,
          Roboto: true,
          Vazirmatn: true,
        },
      },
      language: {
        default: "en",
        languages: {
          en: true,
          fa: true,
        },
      },
    },
    appVersion: import.meta.env.VITE_APP_VERSION || "0.0.0",
    buildHash: import.meta.env.VITE_BUILD_HASH || v4(),
  },
  schema: schema.config,
};

const fixEnvs = () => {
  const traversal = kmTraversal
    .adapter()
    .register(kmTraversal.defaultConditions);
  traversal.traverseIn(
    config.data,
    ['(**).({value.equalWith:"true"})', '(**).({value.equalWith:"false"})'],
    [
      ({ setValue }) => {
        setValue(true);
      },
      ({ setValue }) => {
        setValue(false);
      },
    ],
  );
};

fixEnvs();

export default config;
