import v1 from "./v1";

export const useApiSchemas: () => typeof v1.config = () => {
  return v1.config;
};
