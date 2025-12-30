import kmTraversal from "km-traversal";
import z from "zod";
import type { IConfig } from "./types";
import types from "./types";

const config: IConfig = {
  data: {
    $schema: "./schema.json",
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    setting: {},
  },
  schema: types.schema,
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
