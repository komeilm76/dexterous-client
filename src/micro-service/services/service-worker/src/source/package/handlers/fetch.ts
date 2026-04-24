import { useLogger } from "../composables/log";
import { useSelf } from "../self";
import type { IAppSend, IWorkerSend } from "../messenger.types";
import { useWorkerMessanger } from "../composables/messenger/workerMessanger";
import chalk from "chalk";
import _ from "lodash";

/**
 * Determines if a request should be cached based on URL patterns
 * @param {Request} request - The request object to check
 * @returns {boolean} - True if the request should be cached
 */
const shouldCacheRequest = (request: Request) => {
  // Never cache environment configuration files
  if (request.url.includes("/env/config.json")) {
    console.log("[CACHE] Skipping cache for config file:", request.url);
    return false;
  }
  // Never cache internal API endpoints
  else if (request.url.includes("/api/_lynx/")) {
    console.log("[CACHE] Skipping cache for internal API:", request.url);
    return false;
  } else {
    // Cache all other requests
    console.log("[CACHE] Eligible for caching:", request.url);
    return true;
  }
};

const _self = useSelf();
const { log } = useLogger("worker");
const messenger = useWorkerMessanger<IWorkerSend, IAppSend>();

const handler = () => {
  _self.addEventListener("fetch", (event) => {
    const { request } = event;

    // Skip cache handling for specific requests before entering respondWith
    if (!shouldCacheRequest(request)) {
      console.log("[CACHE] Bypassing service worker for:", request.url);
      return; // Let the browser handle this request normally
    }

    // Handle cache-eligible requests with respondWith
    event.respondWith(
      (async () => {
        try {
          console.log(
            "[CACHE] Processing request through cache strategy:",
            request.url,
          );

          // Get available caches
          const cacheNames = await caches.keys();

          // If no caches exist, fetch directly from network
          if (cacheNames.length === 0) {
            console.log(
              "[CACHE] No caches available, fetching from network:",
              request.url,
            );
            return await fetch(request);
          }

          // Use the first available cache
          const cache = await caches.open(cacheNames[0] as string);

          // Check if response exists in cache
          const cachedResponse = await cache.match(request);
          if (cachedResponse) {
            console.log("[CACHE] Serving from cache:", request.url);
            return cachedResponse;
          }

          // Fetch from network if not in cache
          console.log(
            "[CACHE] Not in cache, fetching from network:",
            request.url,
          );
          const networkResponse = await fetch(request);

          // Only cache successful responses
          if (networkResponse.status === 200) {
            try {
              // Clone response before caching (responses are one-time use)
              await cache.put(request, networkResponse.clone());
              console.log("[CACHE] Successfully cached response:", request.url);
            } catch (cacheError) {
              console.error(
                "[CACHE] Failed to cache response:",
                request.url,
                cacheError,
              );
            }
          } else {
            console.log(
              "[CACHE] Non-200 response, not caching:",
              request.url,
              networkResponse.status,
            );
          }

          return networkResponse;
        } catch (error) {
          // Fallback to network if any error occurs in caching process
          console.error(
            "[CACHE] Error in fetch handler, falling back to network:",
            request.url,
            error,
          );
          return await fetch(request);
        }
      })(),
    );
  });
};

export default { handler };
