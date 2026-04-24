import type { EnvConfig } from "@/micro-modules/env/types";
import { inject } from "vue";

export const loadEnvs = async () => {
  try {
    const res = await fetch("/env/config.json", {
      cache: "no-store", // always fresh
    });
    console.log("res", res);
    return (await res.json()) as EnvConfig;
  } catch (error) {
    console.log("error", error);

    const keys = await caches.keys();
    const cacheKey = keys[0];
    if (cacheKey) {
      const [version, buildHash] = cacheKey.split("_");
      console.log("cacheKey", cacheKey);
      const defaultEnvs: Partial<EnvConfig> = {
        appVersion: version,
        baseUrl: "/",
        buildHash: buildHash,
      };
      return defaultEnvs as EnvConfig;
    } else {
      throw "Application Cant Load";
    }
  }
};

export const useEnvs = () => {
  return inject("envs") as EnvConfig;
};
