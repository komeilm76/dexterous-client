import handlers from "./handlers";
import { useSelf } from "./self";

export const useServiceWorker = () => {
  const _self = useSelf();
  return { _self, handlers };
};
