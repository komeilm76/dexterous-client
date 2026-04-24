import { useLogger } from "../composables/log";
import { useSelf } from "../self";
import type { IAppSend, IWorkerSend } from "../messenger.types";
import { useWorkerMessanger } from "../composables/messenger/workerMessanger";
import chalk from "chalk";
import _ from "lodash";

const canISaveToCache = () => {
  const byResponse = (response: Response) => {
    return false;
  };
  const byRequest = (request: Request) => {
    if (request.url.includes("/env/config.json")) {
      return false;
    } else if (request.url.includes("/api/_lynx/")) {
      return false;
    } else {
      return true;
    }
  };
  return {
    byResponse,
    byRequest,
  };
};

const _self = useSelf();
const { log } = useLogger("worker");
const messenger = useWorkerMessanger<IWorkerSend, IAppSend>();

const handler = () => {
  _self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (!canISaveToCache().byRequest(request)) {
      console.log(`${chalk.bgRed("NO")} - Skipping cache for:`, request.url);
      return; // Let browser handle normally
    } else {
      event.respondWith(
        (async () => {
          try {
            const cache = await caches.open(
              (await caches.keys())[0] || "fallback-cache",
            );
            const cached = await cache.match(request);

            if (cached) {
              console.log("Serving from cache:", request.url);
              return cached;
            }

            const netResponse = await fetch(request);
            if (netResponse.status === 200) {
              cache
                .put(request, netResponse.clone())
                .catch((e) => console.log("Cache store failed:", e));
            }
            return netResponse;
          } catch (err) {
            console.log("Fetch error:", err);
            return fetch(request); // Fallback
          }
        })(),
      );
    }
  });
};

export default { handler };
