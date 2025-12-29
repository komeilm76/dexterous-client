import type { IEnvConfig } from "@/micro/services/env/config";
import { inject } from "vue";

export const loadEnvs = async () => {
  const res = await fetch("/env/config.json", {
    cache: "no-store", // always fresh
  });
  return (await res.json()) as IEnvConfig;
};

export const useEnvs = () => {
  return inject("envs") as IEnvConfig;
};
