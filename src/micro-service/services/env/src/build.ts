import jetpack from "fs-jetpack";
import type { IConfig } from "./config";
import tools from "../../../tools";
import action from "./actions/action-1.ts";

type IOption = {
  renderAgainOnChange: boolean;
  copyAfterRender: boolean;
};

const build = (config: IConfig, entryOptions: IOption) => {
  action(config, entryOptions);
};
export default build;
