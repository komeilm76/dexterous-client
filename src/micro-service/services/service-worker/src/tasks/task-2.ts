import tools from "../../../../tools";
import jetpack from "fs-jetpack";
import { build, defineConfig, type NormalizedOptions } from "tsup";
import { config } from "../config";
import type { IConfig } from "../schemas";

const makeRelativeFromStaticPath = (staticPath: string) => {
  const clearPath = staticPath
    .replace(tools.directories.root, "")
    .split("\\")
    .join("/");
  if (clearPath.startsWith("/")) {
    return clearPath.substring(1);
  } else {
    return clearPath;
  }
};
export default () => {
  return tools.controller.makeMiddleware(async (config, next) => {
    // log
    const { log } = tools.logger.instance(
      "[micro-service/service-worker/task-2]($)",
    );
    log("build start");

    // read Directory
    const readDir = jetpack.path(
      tools.directories.microService,
      "services",
      "service-worker",
      "src",
      "source",
    );
    const staticReadFilePath = jetpack.path(readDir, "index.ts");
    const relativeReadFilePath = makeRelativeFromStaticPath(staticReadFilePath);

    // write Directory
    const writeDir = jetpack.path(
      tools.directories.microModules,
      "service-worker",
    );
    const relativeWriteDirPath = makeRelativeFromStaticPath(writeDir);
    const isExistWriteDir = await jetpack.existsAsync(writeDir);
    if (!isExistWriteDir) {
      await jetpack.dirAsync(writeDir);
    }

    const buildWorker = async () => {
      await build(
        // --------------------------
        // 1️⃣ ESM (for Browser + Node)
        // --------------------------
        // {
        //   entry: [relativeReadFilePath],
        //   outDir: relativeWriteDirPath,

        //   format: ["esm"],
        //   outExtension({ format }) {
        //     // Write as .mjs file
        //     return { js: ".mjs" };
        //   },
        //   dts: true,
        //   sourcemap: true,
        //   clean: true,
        //   target: "esnext",
        //   platform: "neutral", // works in both browser + node
        //   minify: false,
        //   async onSuccess() {
        //     // await fs.copy("src/assets", "dist/assets");
        //     console.log("✅ Copied assets to dist/assets");
        //   },
        // },
        {
          entry: [relativeReadFilePath],
          outDir: relativeWriteDirPath,
          format: ["iife"], // Browser-safe SW format
          splitting: false, // Required for Service Worker
          sourcemap: false, // map file
          clean: true,
          minify: false,

          platform: "browser",
          target: "es2020",

          loader: {
            ".json": "json",
            ".png": "dataurl",
            ".jpg": "dataurl",
            ".svg": "dataurl",
            ".css": "text",
          },

          define: {
            "process.env.NODE_ENV": `"production"`,
          },
        },
      );
    };

    await buildWorker();

    tools.watcher.watchFiles([relativeReadFilePath], async () => {
      await buildWorker();
      log("source was updated in writeDir");
    });

    log("build finished");
    next();

    // -----------------------------------------
  });
};
