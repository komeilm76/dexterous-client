import config from "./config";

export interface ApiConfig {
  config: typeof config;
}

export default {
  config,
} as ApiConfig;
