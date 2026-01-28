import type kmManifest from "km-manifest";

export type IConfig = {
  manifest: ReturnType<
    ReturnType<typeof kmManifest.make<kmManifest.IDefaultMimeType>>["object"]
  >;
  iconSizes: number[];
};
