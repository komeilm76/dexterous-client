import v2 from "./v2";

export const useApiSchemas: () => typeof v2.config = () => {
  return v2.config;
};
