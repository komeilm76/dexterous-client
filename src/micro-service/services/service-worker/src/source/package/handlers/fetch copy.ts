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
    // Respond with a single promise that handles the entire fetch logic
    event.respondWith(
      (async () => {
        try {
          const { request } = event;

          // Check if this request should be cached
          if (!canISaveToCache().byRequest(request)) {
            console.log(
              `${chalk.bgRed("NO")} - Skipping cache for:`,
              request.url,
            );
            const response = await fetch(request);
            return response;
          }

          console.log(
            `${chalk.bgGreen("YES")} - Handling cache for:`,
            request.url,
          );

          // Get cache
          const cacheNames = await caches.keys();
          const cacheName = cacheNames[0];

          if (!cacheName) {
            console.log(
              `${chalk.bgYellow("No cache available, fetching directly")}`,
            );
            const response = await fetch(request);
            return response;
          }

          const cache = await caches.open(cacheName);

          // Try to get response from cache first
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            console.log(
              `${chalk.dim.blue("Serving from cache:")}`,
              request.url,
            );
            return cachedResponse;
          }

          // If not in cache, fetch from network
          console.log(`${chalk.blue("Fetching from network:")}`, request.url);
          const networkResponse = await fetch(request);

          // Clone response for caching (responses can only be used once)
          const responseToCache = networkResponse.clone();

          // Cache successful responses
          if (networkResponse.status === 200) {
            try {
              await cache.put(request, responseToCache);
              console.log(
                `${chalk.green("Cached response for:")}`,
                request.url,
              );
            } catch (cacheError) {
              console.log(
                `${chalk.red("Failed to cache response:")}`,
                cacheError,
              );
            }
          }

          return networkResponse;
        } catch (error) {
          console.log(`${chalk.red("Fetch event error:")}`, error);
          // Fallback to network fetch if anything fails
          return await fetch(event.request);
        }
      })(),
    );
  });
};

export default { handler };
