import type { ServiceWorkerGlobalScope } from "./self.types";

export const useSelf = () => {
  return self as unknown as ServiceWorkerGlobalScope;
};
