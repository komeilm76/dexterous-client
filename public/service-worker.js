(() => {
  // node_modules/chalk/source/vendor/ansi-styles/index.js
  var ANSI_BACKGROUND_OFFSET = 10;
  var wrapAnsi16 = (offset = 0) => (code) => `\x1B[${code + offset}m`;
  var wrapAnsi256 = (offset = 0) => (code) => `\x1B[${38 + offset};5;${code}m`;
  var wrapAnsi16m = (offset = 0) => (red, green, blue) => `\x1B[${38 + offset};2;${red};${green};${blue}m`;
  var styles = {
    modifier: {
      reset: [0, 0],
      // 21 isn't widely supported and 22 does the same thing
      bold: [1, 22],
      dim: [2, 22],
      italic: [3, 23],
      underline: [4, 24],
      overline: [53, 55],
      inverse: [7, 27],
      hidden: [8, 28],
      strikethrough: [9, 29]
    },
    color: {
      black: [30, 39],
      red: [31, 39],
      green: [32, 39],
      yellow: [33, 39],
      blue: [34, 39],
      magenta: [35, 39],
      cyan: [36, 39],
      white: [37, 39],
      // Bright color
      blackBright: [90, 39],
      gray: [90, 39],
      // Alias of `blackBright`
      grey: [90, 39],
      // Alias of `blackBright`
      redBright: [91, 39],
      greenBright: [92, 39],
      yellowBright: [93, 39],
      blueBright: [94, 39],
      magentaBright: [95, 39],
      cyanBright: [96, 39],
      whiteBright: [97, 39]
    },
    bgColor: {
      bgBlack: [40, 49],
      bgRed: [41, 49],
      bgGreen: [42, 49],
      bgYellow: [43, 49],
      bgBlue: [44, 49],
      bgMagenta: [45, 49],
      bgCyan: [46, 49],
      bgWhite: [47, 49],
      // Bright color
      bgBlackBright: [100, 49],
      bgGray: [100, 49],
      // Alias of `bgBlackBright`
      bgGrey: [100, 49],
      // Alias of `bgBlackBright`
      bgRedBright: [101, 49],
      bgGreenBright: [102, 49],
      bgYellowBright: [103, 49],
      bgBlueBright: [104, 49],
      bgMagentaBright: [105, 49],
      bgCyanBright: [106, 49],
      bgWhiteBright: [107, 49]
    }
  };
  var modifierNames = Object.keys(styles.modifier);
  var foregroundColorNames = Object.keys(styles.color);
  var backgroundColorNames = Object.keys(styles.bgColor);
  var colorNames = [...foregroundColorNames, ...backgroundColorNames];
  function assembleStyles() {
    const codes = /* @__PURE__ */ new Map();
    for (const [groupName, group] of Object.entries(styles)) {
      for (const [styleName, style] of Object.entries(group)) {
        styles[styleName] = {
          open: `\x1B[${style[0]}m`,
          close: `\x1B[${style[1]}m`
        };
        group[styleName] = styles[styleName];
        codes.set(style[0], style[1]);
      }
      Object.defineProperty(styles, groupName, {
        value: group,
        enumerable: false
      });
    }
    Object.defineProperty(styles, "codes", {
      value: codes,
      enumerable: false
    });
    styles.color.close = "\x1B[39m";
    styles.bgColor.close = "\x1B[49m";
    styles.color.ansi = wrapAnsi16();
    styles.color.ansi256 = wrapAnsi256();
    styles.color.ansi16m = wrapAnsi16m();
    styles.bgColor.ansi = wrapAnsi16(ANSI_BACKGROUND_OFFSET);
    styles.bgColor.ansi256 = wrapAnsi256(ANSI_BACKGROUND_OFFSET);
    styles.bgColor.ansi16m = wrapAnsi16m(ANSI_BACKGROUND_OFFSET);
    Object.defineProperties(styles, {
      rgbToAnsi256: {
        value(red, green, blue) {
          if (red === green && green === blue) {
            if (red < 8) {
              return 16;
            }
            if (red > 248) {
              return 231;
            }
            return Math.round((red - 8) / 247 * 24) + 232;
          }
          return 16 + 36 * Math.round(red / 255 * 5) + 6 * Math.round(green / 255 * 5) + Math.round(blue / 255 * 5);
        },
        enumerable: false
      },
      hexToRgb: {
        value(hex) {
          const matches = /[a-f\d]{6}|[a-f\d]{3}/i.exec(hex.toString(16));
          if (!matches) {
            return [0, 0, 0];
          }
          let [colorString] = matches;
          if (colorString.length === 3) {
            colorString = [...colorString].map((character) => character + character).join("");
          }
          const integer = Number.parseInt(colorString, 16);
          return [
            /* eslint-disable no-bitwise */
            integer >> 16 & 255,
            integer >> 8 & 255,
            integer & 255
            /* eslint-enable no-bitwise */
          ];
        },
        enumerable: false
      },
      hexToAnsi256: {
        value: (hex) => styles.rgbToAnsi256(...styles.hexToRgb(hex)),
        enumerable: false
      },
      ansi256ToAnsi: {
        value(code) {
          if (code < 8) {
            return 30 + code;
          }
          if (code < 16) {
            return 90 + (code - 8);
          }
          let red;
          let green;
          let blue;
          if (code >= 232) {
            red = ((code - 232) * 10 + 8) / 255;
            green = red;
            blue = red;
          } else {
            code -= 16;
            const remainder = code % 36;
            red = Math.floor(code / 36) / 5;
            green = Math.floor(remainder / 6) / 5;
            blue = remainder % 6 / 5;
          }
          const value = Math.max(red, green, blue) * 2;
          if (value === 0) {
            return 30;
          }
          let result = 30 + (Math.round(blue) << 2 | Math.round(green) << 1 | Math.round(red));
          if (value === 2) {
            result += 60;
          }
          return result;
        },
        enumerable: false
      },
      rgbToAnsi: {
        value: (red, green, blue) => styles.ansi256ToAnsi(styles.rgbToAnsi256(red, green, blue)),
        enumerable: false
      },
      hexToAnsi: {
        value: (hex) => styles.ansi256ToAnsi(styles.hexToAnsi256(hex)),
        enumerable: false
      }
    });
    return styles;
  }
  var ansiStyles = assembleStyles();
  var ansi_styles_default = ansiStyles;

  // node_modules/chalk/source/vendor/supports-color/browser.js
  var level = (() => {
    if (!("navigator" in globalThis)) {
      return 0;
    }
    if (globalThis.navigator.userAgentData) {
      const brand = navigator.userAgentData.brands.find(({ brand: brand2 }) => brand2 === "Chromium");
      if (brand && brand.version > 93) {
        return 3;
      }
    }
    if (/\b(Chrome|Chromium)\//.test(globalThis.navigator.userAgent)) {
      return 1;
    }
    return 0;
  })();
  var colorSupport = level !== 0 && {
    level,
    hasBasic: true,
    has256: level >= 2,
    has16m: level >= 3
  };
  var supportsColor = {
    stdout: colorSupport,
    stderr: colorSupport
  };
  var browser_default = supportsColor;

  // node_modules/chalk/source/utilities.js
  function stringReplaceAll(string, substring, replacer) {
    let index = string.indexOf(substring);
    if (index === -1) {
      return string;
    }
    const substringLength = substring.length;
    let endIndex = 0;
    let returnValue = "";
    do {
      returnValue += string.slice(endIndex, index) + substring + replacer;
      endIndex = index + substringLength;
      index = string.indexOf(substring, endIndex);
    } while (index !== -1);
    returnValue += string.slice(endIndex);
    return returnValue;
  }
  function stringEncaseCRLFWithFirstIndex(string, prefix, postfix, index) {
    let endIndex = 0;
    let returnValue = "";
    do {
      const gotCR = string[index - 1] === "\r";
      returnValue += string.slice(endIndex, gotCR ? index - 1 : index) + prefix + (gotCR ? "\r\n" : "\n") + postfix;
      endIndex = index + 1;
      index = string.indexOf("\n", endIndex);
    } while (index !== -1);
    returnValue += string.slice(endIndex);
    return returnValue;
  }

  // node_modules/chalk/source/index.js
  var { stdout: stdoutColor, stderr: stderrColor } = browser_default;
  var GENERATOR = /* @__PURE__ */ Symbol("GENERATOR");
  var STYLER = /* @__PURE__ */ Symbol("STYLER");
  var IS_EMPTY = /* @__PURE__ */ Symbol("IS_EMPTY");
  var levelMapping = [
    "ansi",
    "ansi",
    "ansi256",
    "ansi16m"
  ];
  var styles2 = /* @__PURE__ */ Object.create(null);
  var applyOptions = (object, options = {}) => {
    if (options.level && !(Number.isInteger(options.level) && options.level >= 0 && options.level <= 3)) {
      throw new Error("The `level` option should be an integer from 0 to 3");
    }
    const colorLevel = stdoutColor ? stdoutColor.level : 0;
    object.level = options.level === void 0 ? colorLevel : options.level;
  };
  var chalkFactory = (options) => {
    const chalk2 = (...strings) => strings.join(" ");
    applyOptions(chalk2, options);
    Object.setPrototypeOf(chalk2, createChalk.prototype);
    return chalk2;
  };
  function createChalk(options) {
    return chalkFactory(options);
  }
  Object.setPrototypeOf(createChalk.prototype, Function.prototype);
  for (const [styleName, style] of Object.entries(ansi_styles_default)) {
    styles2[styleName] = {
      get() {
        const builder = createBuilder(this, createStyler(style.open, style.close, this[STYLER]), this[IS_EMPTY]);
        Object.defineProperty(this, styleName, { value: builder });
        return builder;
      }
    };
  }
  styles2.visible = {
    get() {
      const builder = createBuilder(this, this[STYLER], true);
      Object.defineProperty(this, "visible", { value: builder });
      return builder;
    }
  };
  var getModelAnsi = (model, level2, type, ...arguments_) => {
    if (model === "rgb") {
      if (level2 === "ansi16m") {
        return ansi_styles_default[type].ansi16m(...arguments_);
      }
      if (level2 === "ansi256") {
        return ansi_styles_default[type].ansi256(ansi_styles_default.rgbToAnsi256(...arguments_));
      }
      return ansi_styles_default[type].ansi(ansi_styles_default.rgbToAnsi(...arguments_));
    }
    if (model === "hex") {
      return getModelAnsi("rgb", level2, type, ...ansi_styles_default.hexToRgb(...arguments_));
    }
    return ansi_styles_default[type][model](...arguments_);
  };
  var usedModels = ["rgb", "hex", "ansi256"];
  for (const model of usedModels) {
    styles2[model] = {
      get() {
        const { level: level2 } = this;
        return function(...arguments_) {
          const styler = createStyler(getModelAnsi(model, levelMapping[level2], "color", ...arguments_), ansi_styles_default.color.close, this[STYLER]);
          return createBuilder(this, styler, this[IS_EMPTY]);
        };
      }
    };
    const bgModel = "bg" + model[0].toUpperCase() + model.slice(1);
    styles2[bgModel] = {
      get() {
        const { level: level2 } = this;
        return function(...arguments_) {
          const styler = createStyler(getModelAnsi(model, levelMapping[level2], "bgColor", ...arguments_), ansi_styles_default.bgColor.close, this[STYLER]);
          return createBuilder(this, styler, this[IS_EMPTY]);
        };
      }
    };
  }
  var proto = Object.defineProperties(() => {
  }, {
    ...styles2,
    level: {
      enumerable: true,
      get() {
        return this[GENERATOR].level;
      },
      set(level2) {
        this[GENERATOR].level = level2;
      }
    }
  });
  var createStyler = (open, close, parent) => {
    let openAll;
    let closeAll;
    if (parent === void 0) {
      openAll = open;
      closeAll = close;
    } else {
      openAll = parent.openAll + open;
      closeAll = close + parent.closeAll;
    }
    return {
      open,
      close,
      openAll,
      closeAll,
      parent
    };
  };
  var createBuilder = (self2, _styler, _isEmpty) => {
    const builder = (...arguments_) => applyStyle(builder, arguments_.length === 1 ? "" + arguments_[0] : arguments_.join(" "));
    Object.setPrototypeOf(builder, proto);
    builder[GENERATOR] = self2;
    builder[STYLER] = _styler;
    builder[IS_EMPTY] = _isEmpty;
    return builder;
  };
  var applyStyle = (self2, string) => {
    if (self2.level <= 0 || !string) {
      return self2[IS_EMPTY] ? "" : string;
    }
    let styler = self2[STYLER];
    if (styler === void 0) {
      return string;
    }
    const { openAll, closeAll } = styler;
    if (string.includes("\x1B")) {
      while (styler !== void 0) {
        string = stringReplaceAll(string, styler.close, styler.open);
        styler = styler.parent;
      }
    }
    const lfIndex = string.indexOf("\n");
    if (lfIndex !== -1) {
      string = stringEncaseCRLFWithFirstIndex(string, closeAll, openAll, lfIndex);
    }
    return openAll + string + closeAll;
  };
  Object.defineProperties(createChalk.prototype, styles2);
  var chalk = createChalk();
  var chalkStderr = createChalk({ level: stderrColor ? stderrColor.level : 0 });
  var source_default = chalk;

  // src/micro-service/services/service-worker/src/source/package/composables/log.ts
  var useLogger = (entryTag) => {
    const tag = source_default.blueBright(`<[${entryTag}]>`);
    const log5 = (entryText) => {
      const text = `${tag}: ${source_default.dim(entryText)}`;
      const show = () => {
        console.log(text);
      };
      return {
        text,
        show
      };
    };
    return {
      log: log5
    };
  };

  // src/micro-service/services/service-worker/src/source/package/self.ts
  var useSelf = () => {
    return self;
  };

  // src/micro-service/services/service-worker/src/source/package/composables/messenger/workerMessanger.ts
  var useWorkerMessanger = () => {
    const _self5 = useSelf();
    const send = async (clientId, type, data) => {
      const client = await _self5.clients.get(clientId);
      if (client) {
        client.postMessage({ [type]: data });
      }
    };
    const sendToAll = async (type, data) => {
      const clientList = await _self5.clients.matchAll();
      for await (const client of clientList) {
        client.postMessage({ [type]: data });
      }
    };
    const listen = (type, cb) => {
      _self5.addEventListener("message", (event) => {
        const { data } = event;
        const events = Object.keys(data);
        if (events.includes(type)) {
          cb({ data: data[type] });
        }
      });
    };
    return { send, sendToAll, listen };
  };

  // src/micro-service/services/service-worker/src/source/package/handlers/activate.ts
  var _self = useSelf();
  var { log } = useLogger("worker");
  var messenger = useWorkerMessanger();
  var handler = () => {
    _self.addEventListener("activate", (e) => {
      e.waitUntil(
        _self.clients.claim().then(() => {
          log("activated successfully").show();
          messenger.sendToAll("worker_activated", {});
        })
      );
    });
  };
  var activate_default = { handler };

  // src/micro-service/services/service-worker/src/source/package/handlers/install.ts
  var _self2 = useSelf();
  var { log: log2 } = useLogger("worker");
  var messenger2 = useWorkerMessanger();
  var handler2 = () => {
    _self2.addEventListener("install", (e) => {
      e.waitUntil(
        _self2.skipWaiting().then(() => {
          log2("installed successfully").show();
          messenger2.sendToAll("worker_installed", {});
        })
      );
    });
  };
  var install_default = { handler: handler2 };

  // src/micro-service/services/service-worker/src/source/package/handlers/message.ts
  var deleteCacheStorageByKey = async (cacheStorageKeys) => {
    for await (const key of cacheStorageKeys) {
      caches.delete(key);
    }
  };
  var deleteExpiredCacheStoragesByNewKey = async (newCacheStorageKey) => {
    const cacheStorageKeys = await caches.keys();
    const expiredCacheStorageKeys = cacheStorageKeys.filter((item) => {
      return item !== newCacheStorageKey;
    });
    await deleteCacheStorageByKey(expiredCacheStorageKeys);
  };
  var _self3 = useSelf();
  var { log: log3 } = useLogger("worker");
  var messenger3 = useWorkerMessanger();
  var handler3 = () => {
    messenger3.listen("update_worker", async (e) => {
      const newCacheStorageKey = e.data;
      const cacheKeys = await _self3.caches.keys();
      const hasCache = cacheKeys.length > 0;
      const hasThisVersion = await _self3.caches.has(newCacheStorageKey);
      const reload = hasCache == true && hasThisVersion == false;
      await deleteExpiredCacheStoragesByNewKey(newCacheStorageKey);
      caches.open(newCacheStorageKey);
      if (reload == true) {
        messenger3.sendToAll("worker_updated", { reload });
      }
    });
  };
  var message_default = { handler: handler3 };

  // src/micro-service/services/service-worker/src/source/package/handlers/fetch.ts
  var shouldCacheRequest = (request) => {
    if (request.url.includes("/env/config.json")) {
      console.log("[CACHE] Skipping cache for config file:", request.url);
      return false;
    } else if (request.url.includes("/api/_lynx/")) {
      console.log("[CACHE] Skipping cache for internal API:", request.url);
      return false;
    } else {
      console.log("[CACHE] Eligible for caching:", request.url);
      return true;
    }
  };
  var _self4 = useSelf();
  var { log: log4 } = useLogger("worker");
  var messenger4 = useWorkerMessanger();
  var handler4 = () => {
    _self4.addEventListener("fetch", (event) => {
      const { request } = event;
      if (!shouldCacheRequest(request)) {
        console.log("[CACHE] Bypassing service worker for:", request.url);
        return;
      }
      event.respondWith(
        (async () => {
          try {
            console.log(
              "[CACHE] Processing request through cache strategy:",
              request.url
            );
            const cacheNames = await caches.keys();
            if (cacheNames.length === 0) {
              console.log(
                "[CACHE] No caches available, fetching from network:",
                request.url
              );
              return await fetch(request);
            }
            const cache = await caches.open(cacheNames[0]);
            const cachedResponse = await cache.match(request);
            if (cachedResponse) {
              console.log("[CACHE] Serving from cache:", request.url);
              return cachedResponse;
            }
            console.log(
              "[CACHE] Not in cache, fetching from network:",
              request.url
            );
            const networkResponse = await fetch(request);
            if (networkResponse.status === 200) {
              try {
                await cache.put(request, networkResponse.clone());
                console.log("[CACHE] Successfully cached response:", request.url);
              } catch (cacheError) {
                console.error(
                  "[CACHE] Failed to cache response:",
                  request.url,
                  cacheError
                );
              }
            } else {
              console.log(
                "[CACHE] Non-200 response, not caching:",
                request.url,
                networkResponse.status
              );
            }
            return networkResponse;
          } catch (error) {
            console.error(
              "[CACHE] Error in fetch handler, falling back to network:",
              request.url,
              error
            );
            return await fetch(request);
          }
        })()
      );
    });
  };
  var fetch_default = { handler: handler4 };

  // src/micro-service/services/service-worker/src/source/package/handlers/index.ts
  var handlers_default = {
    install: install_default,
    activate: activate_default,
    message: message_default,
    _fetch: fetch_default
  };

  // src/micro-service/services/service-worker/src/source/package/index.ts
  var useServiceWorker = () => {
    const _self5 = useSelf();
    return { _self: _self5, handlers: handlers_default };
  };

  // src/micro-service/services/service-worker/src/source/index.ts
  var { handlers } = useServiceWorker();
  handlers.install.handler();
  handlers.activate.handler();
  handlers.message.handler();
  handlers._fetch.handler();
})();
