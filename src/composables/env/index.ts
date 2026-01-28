import type { EnvConfig } from "@/micro-modules/env/types";
import { inject } from "vue";

export const loadEnvs = async () => {
  const res = await fetch("/env/config.json", {
    cache: "no-store", // always fresh
  });
  return (await res.json()) as EnvConfig;
};

export const useEnvs = () => {
  return inject("envs") as EnvConfig;
};
