import jetpack from "fs-jetpack";
import tools from "../../../tools";
import { kmIcon } from "km-icon";

type IOption = {
  renderAgainOnChange: boolean;
  copyAfterRender: boolean;
};

const build = async (
  config: kmIcon.iFontawesomeConfig,
  entryOptions: IOption,
) => {
  // log
  const step = { value: 0 };
  const logLabel = "[micro/icon]($)";
  tools.logger.log(step, logLabel, "start");
  // -----------------------------------------
  // file name
  const fileName = "icon-fonts.ts";
  // Write Directory
  const writeDir = jetpack.path(
    tools.directories.microService,
    "./services/icon/dist",
  );
  const fullNameInWriteDir = jetpack.path(writeDir, fileName);
  // Use Directory
  const useDir = jetpack.path(tools.directories.root, "./");
  const fullNameInUseDir = jetpack.path(useDir, fileName);

  // name of css files
  const { names } = kmIcon.fontawesome.makeConfig(config);
  const usingPath = names.map(
    (i) => `km-icon/assets/fontawesome/v7/pro/imports/${i}.css` as const,
  );

  const prettyData = await tools.prettier.pretty(
    `export const registerIconFonts = async ()=>{
        ${usingPath.map((i) => `await import("${i}");`).join("")}
        }`,
    {
      parser: "typescript",
      printWidth: 100,
      tabWidth: 2,
      useTabs: false,
      singleQuote: false,
    },
  );

  jetpack.writeAsync(fullNameInWriteDir, prettyData).then((res) => {
    tools.logger.log(step, logLabel, "writed file in 'writeDir'");
  });
  // -----------------------------------------
};
export default build;
