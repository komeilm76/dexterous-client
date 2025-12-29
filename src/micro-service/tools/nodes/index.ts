import jetpack from "fs-jetpack";

const getNodePaths = (path: string) => {
  const files = jetpack.dir(path).find({
    files: true,
    directories: false,
  });
  const dirs = jetpack.dir(path).find({
    files: false,
    directories: true,
  });
  return { files, dirs };
};

export default { getNodePaths };
