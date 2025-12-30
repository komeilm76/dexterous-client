import kmTraversal from "km-traversal";
import z from "zod";
import schema from "./schema";

const envs = import.meta.env;

export type IConfig = {
  envs: z.infer<typeof schema.zodSchema>;
  schema: typeof schema;
};
const config: IConfig = {
  envs: {
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    setting: {},
  },
  schema,
};

const fixEnvs = () => {
  const traversal = kmTraversal
    .adapter()
    .register(kmTraversal.defaultConditions);
  traversal.traverseIn(
    config.envs,
    ['(**).({value.equalWith:"true"})', '(**).({value.equalWith:"false"})'],
    [
      ({ setValue }) => {
        console.log("was");
        setValue(true);
      },
      ({ setValue }) => {
        console.log("was");
        setValue(false);
      },
    ],
  );
};

fixEnvs();

export default config;
