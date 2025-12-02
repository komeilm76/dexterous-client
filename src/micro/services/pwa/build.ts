import kmManifest from "km-manifest";
import config from "./config";
import jetpack from "fs-jetpack";
import sharp from "sharp";
import logo from "./logo.png";
import ico from "sharp-ico";
const build = async (
  config: kmManifest.IManifestConfig<kmManifest.IDefaultMimeType>
) => {
  const buildFolder = jetpack.dir("./src/micro/services/pwa/dist");
  const files = buildFolder.find({ files: true, directories: false });
  files.forEach((item) => {
    buildFolder.remove(item);
  });
  const makeValidPath = (path: string) => {
    if (path.startsWith("./")) {
      return path;
    } else if (path.startsWith("/")) {
      return `.${path}`;
    } else {
      return `./${path}`;
    }
  };

  buildFolder.write("pwa/manifest.json", config);

  // generate icons
  for await (const item of config.icons) {
    const [width, height] = item.sizes.split("x").map((i) => Number(i));
    const regex = /(png|jpg|svg|svg\+xml)/g;
    const findedFormat = item.type?.match(regex);
    const format = !!findedFormat
      ? (findedFormat["0"] as "png" | "svg" | "jpg")
      : undefined;
    if (format) {
      const icon = await sharp(logo)
        .resize({ width, height })
        .toFormat(format)
        .toBuffer();

      await buildFolder.write(makeValidPath(item.src), icon);
    }
  }
  // generate ico
  const bufferLogo = await sharp(logo)
    .resize({ width: 64, height: 64 })
    .toBuffer();
  const bufferIco = ico.encode([bufferLogo]);
  buildFolder.write("/icons/favicon.ico", bufferIco);

  const pastFolder = jetpack.dir("./public/pwa");
  await pastFolder.removeAsync();
  // for await (const item of filesOfPastFolder) {
  //   await pastFolder.removeAsync(item);
  // }
  await jetpack.copyAsync("./src/micro/services/pwa/dist/pwa", "./public/pwa");
};
export default build;
