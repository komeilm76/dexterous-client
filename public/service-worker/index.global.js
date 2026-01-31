(() => {
  // src/micro-service/services/service-worker/src/source/utils.ts
  var testFunction = () => {
    return "its my birthday";
  };
  var utils_default = { testFunction };

  // src/micro-service/services/service-worker/src/source/index.ts
  console.log("utils.testFunctions()", utils_default.testFunction());
  var sw = self;
  sw.addEventListener("install", () => {
    sw.skipWaiting();
  });
  sw.addEventListener("activate", () => {
    sw.clients.claim();
  });
  var index_default = { test: () => {
  } };
})();
//# sourceMappingURL=index.global.js.map