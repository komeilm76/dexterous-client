import jetpack from "fs-jetpack";

const rootDir = jetpack.path(jetpack.cwd(), "./");
const publicDir = jetpack.path(jetpack.cwd(), "./public");
const srcDir = jetpack.path(jetpack.cwd(), "./src");
const microServiceDir = jetpack.path(jetpack.cwd(), "./src/micro-service");
export default {
  root: rootDir,
  public: publicDir,
  src: srcDir,
  microService: microServiceDir,
};
