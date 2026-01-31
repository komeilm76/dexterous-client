import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import { kmIcon } from "km-icon";
import type { IConfig } from "../schemas";

export default () => {
  return tools.controller.makeMiddleware<IConfig>(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/icon]($)");
    // -----------------------------------------
    // file name
    const fileName = "icon-fonts.ts";
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microModules,
      "./icon",
    );
    const fullNameInWriteDir = jetpack.path(writeDir, fileName);
    // Use Directory
    const useDir = jetpack.path(tools.directories.root, "./");
    const fullNameInUseDir = jetpack.path(useDir, fileName);

    // name of css files
    const usingPath = config.names.map(
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
      log("writed file in 'writeDir'");
    });
    // -----------------------------------------
  });
};
