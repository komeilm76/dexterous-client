import type { ServiceWorkerGlobalScope } from "../self.types";
import { useLogger } from "../composables/log";
import { useSelf } from "../self";
import type { IAppSend, IWorkerSend } from "../messenger.types";
import { useWorkerMessanger } from "../composables/messenger/workerMessanger";

const addToCache = async (cacheStorageKey: string, files: string[]) => {
  const cacheStorage = await caches.open(cacheStorageKey);
  return cacheStorage.addAll(files);
};
const deleteCacheStorageByKey = async (cacheStorageKeys: string[]) => {
  for await (const key of cacheStorageKeys) {
    caches.delete(key);
  }
};
const deleteExpiredCacheStoragesByNewKey = async (
  newCacheStorageKey: string,
) => {
  const cacheStorageKeys = await caches.keys();
  const expiredCacheStorageKeys = cacheStorageKeys.filter((item) => {
    return item !== newCacheStorageKey;
  });
  await deleteCacheStorageByKey(expiredCacheStorageKeys);
};

const _self = useSelf();
const { log } = useLogger("worker");
const messenger = useWorkerMessanger<IWorkerSend, IAppSend>();
const handler = () => {
  messenger.listen("update_worker", async (e) => {
    const newCacheStorageKey = e.data;
    const cacheKeys = await _self.caches.keys();
    const hasCache = cacheKeys.length > 0;
    const hasThisVersion = await _self.caches.has(newCacheStorageKey);
    const reload = hasCache == true && hasThisVersion == false;
    await deleteExpiredCacheStoragesByNewKey(newCacheStorageKey);
    caches.open(newCacheStorageKey);
    if (reload == true) {
      messenger.sendToAll("worker_updated", { reload });
    }
  });
};

export default { handler };
