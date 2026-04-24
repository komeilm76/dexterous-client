/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import type { App } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { routes } from "vue-router/auto-routes";
import guards from "./guards";

// router/types.ts
export type AccessRole = "admin" | "operator" | "guest" | "public";

declare module "vue-router" {
  interface RouteMeta {
    whoCanAccessThisRoute?: AccessRole[];
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.isReady().then(() => {
  localStorage.removeItem("vuetify:dynamic-reload");
});

router.beforeEach(guards.authGuard.install);

const install = (app: App<Element>) => {
  app.use(router);
};

export const useAppRouter = () => {
  return router;
};

export default { install, useAppRouter };
