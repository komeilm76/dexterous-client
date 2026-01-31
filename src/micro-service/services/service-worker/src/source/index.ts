/// <reference lib="webworker" />

import utils from "./utils";

console.log("utils.testFunctions()", utils.testFunction());

const sw = self as unknown as ServiceWorkerGlobalScope;

sw.addEventListener("install", () => {
  sw.skipWaiting();
});

sw.addEventListener("activate", () => {
  sw.clients.claim();
});

export default { test: () => {} };
