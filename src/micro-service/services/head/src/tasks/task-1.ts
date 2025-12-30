import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import generator from "../generator";

export default () => {
  return tools.controller.makeMiddleware((config, next) => {
    // log
    const { log } = tools.logger.instance("[micro/head]($)");
    // -----------------------------------------
    // file name
    const fileName = "index.html";
    // read Directory
    const readDir = jetpack.path(tools.directories.root, "./");
    const fullNameInReadDir = jetpack.path(readDir, fileName);
    // Write Directory
    const writeDir = jetpack.path(
      tools.directories.microService,
      "./services/head/dist",
    );
    const fullNameInWriteDir = jetpack.path(writeDir, fileName);
    // Use Directory
    const useDir = jetpack.path(tools.directories.root, "./");
    const fullNameInUseDir = jetpack.path(useDir, fileName);

    const escapeRegex = (str: string) =>
      str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    // head tags
    const headTagsAsString = generator.renderHeadToString(config);
    const startLabel = "<!-- micro/head/start -->";
    const endLabel = "<!-- micro/head/end -->";
    const startRegex = new RegExp(escapeRegex(startLabel));
    const endRegex = new RegExp(escapeRegex(endLabel));
    const regex = new RegExp(`(${startLabel})(.*?)(${endLabel})`);
    const betweenRegex = new RegExp(
      `(${escapeRegex(startLabel)})([\\s\\S]*?)(${escapeRegex(endLabel)})`,
      "g",
    );

    jetpack.readAsync(fullNameInReadDir, "utf8").then(async (readData) => {
      log("readed file from 'readDir'");
      if (readData) {
        const haveStartLabel = startRegex.test(readData);
        const haveEndLabel = endRegex.test(readData);
        if (haveStartLabel && haveEndLabel) {
          readData = readData.replace(
            betweenRegex,
            `$1\n${headTagsAsString}\n$3`,
          );
          const prettyData = await tools.prettier.pretty(readData, {
            parser: "html",
            printWidth: 100,
            tabWidth: 2,
            useTabs: false,
            singleQuote: false,
            htmlWhitespaceSensitivity: "css",
          });
          log("data was pretty");
          jetpack.writeAsync(fullNameInWriteDir, prettyData).then((res) => {
            log("writed file in 'writeDir'");

            if (fullNameInUseDir !== fullNameInWriteDir) {
              const nodes = tools.nodes.getNodePaths(writeDir);
              nodes.files.forEach((node) => {
                jetpack
                  .copyAsync(writeDir, useDir, { overwrite: true })
                  .then((res) => {
                    log("writed files copy to 'useDir'");
                  });
              });
            }
          });
        } else {
          throw new Error(
            `Please add startLabel:'${startLabel}' and endLabel:'${endLabel}' inside HTML`,
          );
        }
      }
    });

    // -----------------------------------------
  });
};
