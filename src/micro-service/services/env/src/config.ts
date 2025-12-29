import kmTraversal from "km-traversal";
import microServiceConfig from "../../../../configs/micro/index";
import z from "zod";

const configSchema = z.object({
  baseUrl: z.string(),
  setting: z.object({}),
});
export type IEnvConfig = z.infer<typeof configSchema>;

const envs = import.meta.env;
const config: z.infer<typeof configSchema> = {
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  setting: {},
};
const traversal = kmTraversal.adapter().register(kmTraversal.defaultConditions);
traversal.traverseIn(
  config,
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
export default config;
