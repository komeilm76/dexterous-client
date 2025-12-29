import jetpack from "fs-jetpack";
import type { IEnvConfig } from "./config";
import tools from "../../../tools";

type IOption = {
  renderAgainOnChange: boolean;
  copyAfterRender: boolean;
};

const build = (config: IEnvConfig, entryOptions: IOption) => {
  // log
  const step = { value: 0 };
  const logLabel = "[micro/env]($)";
  tools.logger.log(step, logLabel, "start");
  // -----------------------------------------
  // file name
  const fileName = "config.json";
  // Write Directory
  const writeDir = jetpack.path(
    tools.directories.microService,
    "./services/env/dist",
  );
  const fullNameInWriteDir = jetpack.path(writeDir, fileName);
  // Use Directory
  const useDir = jetpack.path(tools.directories.public, "./env");
  const fullNameInUseDir = jetpack.path(useDir, fileName);
  if (entryOptions.renderAgainOnChange == true) {
    Promise.all([
      jetpack.removeAsync(writeDir),
      jetpack.removeAsync(useDir),
    ]).then((res) => {
      tools.logger.log(
        step,
        logLabel,
        "removed files from 'writeDir' & 'useDir'",
      );
      jetpack.writeAsync(fullNameInWriteDir, config).then((res) => {
        tools.logger.log(step, logLabel, "writed files to 'writeDir'");

        if (fullNameInUseDir !== fullNameInWriteDir) {
          const nodes = tools.nodes.getNodePaths(writeDir);
          nodes.files.forEach((node) => {
            jetpack.copyAsync(writeDir, useDir).then((res) => {
              tools.logger.log(step, logLabel, "writed files copy to 'useDir'");
            });
          });
        }
      });
    });
  }
  // -----------------------------------------
};
export default build;
