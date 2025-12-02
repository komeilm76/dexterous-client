import type kmManifest from "km-manifest";
import build from "./build";
import config from "./config";

build(config as kmManifest.IManifestConfig<kmManifest.IDefaultMimeType>);
