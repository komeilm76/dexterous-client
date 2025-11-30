import { createApp, type App } from "vue";
import { createPinia } from "pinia";
import piniaPluginPersistedstate, {
  createPersistedState,
} from "pinia-plugin-persistedstate";
import { type StorageLike } from "pinia-plugin-persistedstate";

const install = (app: App<Element>) => {
  const pinia = createPinia();
  pinia.use(
    createPersistedState({
      key(storeKey) {
        const prefix = import.meta.env.VITE_APP_PINIA_PERSISTED_PREFIX;
        return prefix ? `${prefix}-${storeKey}` : storeKey;
      },
    })
  );
  app.use(pinia);
};

export default { install };
