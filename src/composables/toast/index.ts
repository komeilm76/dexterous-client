import _ from "lodash";
import { Subject } from "rxjs";
import { v4 as uuidV4 } from "uuid";
import { computed, ref, watch } from "vue";
import z from "zod";
import { useCountdown } from "@vueuse/core";
import { useAppToast } from "@/stores/application/toast";
import tools from "@/tools";

/**
 * Schema for toast notification types
 * Defines the allowed toast types: success, info, error, or warning
 */
const toastType = z.enum(["success", "info", "error", "warning"]);

/**
 * Schema for toast location positioning
 * Defines where the toast should appear on screen
 * @property {('left'|'right'|'center')} x - Horizontal position
 * @property {('top'|'bottom'|'center')} y - Vertical position
 */
const locationSchema = z.object({
  x: z.enum(["left", "right", "center"]),
  y: z.enum(["top", "bottom", "center"]),
});

/**
 * Schema for toast entry configuration
 * Defines the structure for creating a new toast notification
 *
 * @typedef {Object} IEntryToast
 * @property {string} title - The main title text of the toast
 * @property {string[]} [messages] - Optional array of additional message lines
 * @property {Object} [actions] - Optional action buttons for the toast
 * @property {Object} [location] - Optional positioning configuration
 * @property {string} [color] - Optional custom color for the toast
 * @property {('success'|'info'|'error'|'warning')} [type] - Optional toast type
 * @property {number} [showTime] - Optional duration in milliseconds to show the toast
 * @property {number} [showMessageDelay] - Optional delay before showing messages
 *
 * @example
 * const myToast = {
 *   title: "Operation Successful",
 *   messages: ["File has been uploaded", "Processing will begin shortly"],
 *   type: "success",
 *   showTime: 5000,
 *   actions: {
 *     view: {
 *       label: "View Details",
 *       variant: "elevated",
 *       entryTask: ({ setLoadingValue, stop }) => {
 *         setLoadingValue(true);
 *         // Perform action...
 *         setLoadingValue(false);
 *         stop();
 *       }
 *     }
 *   }
 * };
 */
const entryToast = z.object({
  title: z.string(),
  messages: z.string().array().optional(),
  actions: z
    .record(
      z.string(),
      z.object({
        label: z.string(),
        variant: z
          .enum(["elevated", "flat", "outlined", "plain", "text", "tonal"])
          .optional(),
        entryTask: z.function({
          input: [
            z.object({
              setLoadingValue: z.function({ input: [z.boolean()] }),
              pause: z.function(),
              resume: z.function(),
              stop: z.function(),
            }),
          ],
        }),
      }),
    )
    .optional(),
  location: locationSchema.partial().optional(),
  color: z.string().optional(),
  type: toastType.optional(),
  showTime: z.number().optional(),
  showMessageDelay: z.number().optional(),
  closable: z.boolean().optional(),
  canSave: z.boolean().optional(),
  canPause: z.boolean().optional(),
});

type IEntryToast = z.infer<typeof entryToast>;
export type IToast = ReturnType<typeof _makeToast<IEntryToast>>;

/**
 * Internal function to create a toast instance with all lifecycle methods
 * Transforms an entry toast configuration into a fully functional toast object
 *
 * @private
 * @template ENTRY_TOAST
 * @param {ENTRY_TOAST} entryToast - The toast configuration object
 * @param {IToastServiceOptions} options - Service-level configuration options
 * @returns {IToast} A complete toast object with methods for control and state management
 *
 * @description
 * This function:
 * - Generates a unique ID for the toast
 * - Sets up countdown timer for auto-dismiss
 * - Processes action buttons with loading states
 * - Manages toast lifecycle (not-started -> active -> finished)
 * - Provides pause/resume/stop controls
 * - Tracks save status for toast history
 * - Calculates remaining time percentage for progress display
 */
const _makeToast = <ENTRY_TOAST extends IEntryToast>(
  entryToast: ENTRY_TOAST,
  options: IToastServiceOptions,
) => {
  const showTime = entryToast.showTime || options.defaultShowTime;

  const closable =
    entryToast.closable !== undefined ? entryToast.closable : true;
  const canSave = entryToast.canSave !== undefined ? entryToast.canSave : false;
  const canPause =
    entryToast.canPause !== undefined ? entryToast.canPause : true;

  const status = ref<"not-started" | "active" | "finished">("not-started");
  const saveStatus = ref<boolean>(false);

  const {
    start: _start,
    stop: _stop,
    remaining,
    pause: _pause,
    resume,
    isActive,
  } = useCountdown(showTime / options.defaultInterval, {
    onComplete() {
      status.value = "finished";
      options.checker.next({ eventType: "please_retry_show" });
    },
    interval: options.defaultInterval,
  });

  const start = () => {
    status.value = "active";
    _start();
  };
  const pause = () => {
    if (canPause) {
      _pause();
    } else {
      console.warn("canPause is false. you can't pause this toast.");
    }
  };
  const stop = () => {
    if (closable) {
      status.value = "finished";
      _stop();
      options.checker.next({ eventType: "please_retry_show" });
    } else {
      console.warn("closable is false. you can't close this toast.");
    }
  };

  // Build output actions now that pause/stop/resume are declared
  const outputActions: Record<
    string,
    {
      task: () => void;
      label: string;
      loading: boolean;
    }
  > = {};

  for (const key in entryToast.actions) {
    const loading = ref(false);
    const element = entryToast.actions[key];

    const actionOutput = {
      task: () => {
        element?.entryTask({
          setLoadingValue: (v) => {
            loading.value = v;
          },
          pause,
          resume,
          stop,
        });
      },
      variant: element ? element.variant : "elevated",
      label: element ? element?.label : "label is required",
      loading,
    };
    // @ts-ignore
    outputActions[key] = actionOutput;
  }

  const data = {
    ...entryToast,
    id: uuidV4(),
    createdOn: new Date(),
    actions: outputActions,
    saveToastInHistory: () => {
      if (canSave) {
        saveStatus.value = true;
        options.checker.next({ eventType: "please_save", data: output });
      } else {
        console.warn("canSave is false. you can't save this toast");
      }
    },
    ...(entryToast.showMessageDelay
      ? { showMessageDelay: entryToast.showMessageDelay }
      : { showMessageDelay: 0 }),
    deleteToastFromHistory: () => {
      saveStatus.value = false;
      options.checker.next({
        eventType: "please_delete_from_saved",
        data: output.id,
      });
    },
    ...(entryToast.location
      ? {
          location: {
            x: entryToast.location.x ? entryToast.location.x : "right",
            y: entryToast.location.y ? entryToast.location.y : "bottom",
          },
        }
      : { location: { x: "right", y: "bottom" } }),
    // showTime
    showTime,
    // type
    ...(entryToast.type
      ? { type: entryToast.type }
      : { type: options.defaultType }),
    // messages
    ...(entryToast.messages
      ? { messages: entryToast.messages }
      : { messages: [] }),

    closable,
    canSave,
    canPause,
  };

  const showMessagesTime = ref(false);
  watch(status, async (n) => {
    if (n == "active") {
      await tools.time.wait(data.showMessageDelay);
      showMessagesTime.value = true;
    }
  });
  const canShowMessageList = computed(() => {
    return showMessagesTime.value;
  });
  const isSaved = computed(() => {
    return saveStatus.value;
  });

  const remainingPercent = computed(() => {
    const totalTime = showTime;

    return (
      (remaining.value * options.defaultInterval * 100) /
      totalTime
    ).toFixed();
  });

  const output = {
    ...data,
    start,
    stop,
    pause,
    resume,
    remaining,
    isActive,
    status,
    isSaved,
    canShowMessageList,
    remainingPercent,
  };
  return output;
};

type IToastActionOutout = {
  label: string;
  task: () => void;
  loading: ReturnType<typeof ref<boolean>>;
};

/**
 * Type definition for internal event communication
 * Used by the RxJS Subject to manage toast lifecycle events
 *
 * @typedef {Object} ICheckerEventData
 * @property {string} eventType - The type of event being triggered
 *
 * Event types:
 * - "please_add_to_list": Add toast to queue
 * - "please_show": Display toast immediately
 * - "please_retry_show": Try showing next toast in queue
 * - "please_hide": Hide a specific toast
 * - "please_save": Save toast to history
 * - "please_delete_from_saved": Remove toast from history
 */
type ICheckerEventData =
  | {
      eventType: "please_add_to_list";
      data: IToast;
    }
  | {
      eventType: "please_show";
      data: IToast;
    }
  | { eventType: "please_retry_show" }
  | {
      eventType: "please_hide";
      data: IToast;
    }
  | {
      eventType: "please_save";
      data: IToast;
    }
  | {
      eventType: "please_delete_from_saved";
      data: IToast["id"];
    };

/**
 * Configuration options for the toast service
 *
 * @typedef {Object} IToastServiceOptions
 * @property {number} maxShow - Maximum number of toasts to display simultaneously
 * @property {number} maxHold - Maximum number of finished toasts to retain in the list before pruning
 * @property {number} defaultInterval - Interval in milliseconds for countdown timer updates
 * @property {number} defaultShowTime - Default duration in milliseconds to show each toast
 * @property {('success'|'info'|'error'|'warning')} defaultType - Default toast type
 * @property {Subject<ICheckerEventData>} checker - RxJS Subject for internal event management
 */
export type IToastServiceOptions = {
  maxShow: number;
  maxHold: number;
  defaultInterval: number;
  defaultShowTime: number;
  defaultType: z.infer<typeof toastType>;
  checker: Subject<ICheckerEventData>;
};

/**
 * Creates and configures a toast notification service
 * This is the main factory function for the toast system
 *
 * @param {Partial<IToastServiceOptions>} entryOptions - Optional configuration overrides
 * @returns {Object} Toast service with methods and computed lists
 * @returns {Function} returns.show - Function to display a new toast
 * @returns {ComputedRef<IToast[]>} returns.activeList - Currently displayed toasts
 * @returns {ComputedRef<IToast[]>} returns.notStartedList - Toasts waiting in queue
 * @returns {ComputedRef<IToast[]>} returns.finishedList - Completed toasts
 *
 * @example
 * // Basic setup with defaults
 * const toastService = makeToastService({});
 *
 * // Show a simple toast
 * toastService.show({
 *   title: "Welcome!",
 *   type: "info"
 * });
 *
 * @example
 * // Advanced setup with custom options
 * const toastService = makeToastService({
 *   maxShow: 3,
 *   defaultShowTime: 5000,
 *   defaultType: "success"
 * });
 *
 * // Show toast with actions and messages
 * toastService.show({
 *   title: "File Upload Complete",
 *   messages: [
 *     "document.pdf has been uploaded successfully",
 *     "Processing will take approximately 2 minutes"
 *   ],
 *   type: "success",
 *   showTime: 6000,
 *   location: { x: "right", y: "top" },
 *   actions: {
 *     view: {
 *       label: "View File",
 *       variant: "elevated",
 *       entryTask: ({ setLoadingValue, stop }) => {
 *         setLoadingValue(true);
 *         // Navigate to file
 *         setTimeout(() => {
 *           setLoadingValue(false);
 *           stop();
 *         }, 1000);
 *       }
 *     },
 *     dismiss: {
 *       label: "Dismiss",
 *       variant: "text",
 *       entryTask: ({ stop }) => {
 *         stop();
 *       }
 *     }
 *   }
 * });
 *
 * @example
 * // Access toast lists
 * watch(toastService.activeList, (toasts) => {
 *   console.log(`Currently showing ${toasts.length} toasts`);
 * });
 *
 * @description
 * The toast service manages a queue of notifications with these features:
 * - Automatic queuing when max simultaneous toasts exceeded
 * - Countdown timers with pause/resume capability
 * - Action buttons with loading states
 * - Toast history persistence
 * - Customizable positioning and styling
 * - Event-driven architecture using RxJS
 * - Automatic pruning of finished toasts beyond maxHold limit
 *
 * Default values:
 * - maxShow: 4
 * - maxHold: 20
 * - defaultInterval: 80ms
 * - defaultShowTime: 4000ms (4 seconds)
 * - defaultType: "info"
 */
export const makeToastService = (
  entryOptions: Partial<IToastServiceOptions>,
) => {
  const options: IToastServiceOptions = {
    ...(entryOptions.maxShow !== undefined
      ? { maxShow: entryOptions.maxShow }
      : { maxShow: 4 }),
    ...(entryOptions.maxHold !== undefined
      ? { maxHold: entryOptions.maxHold }
      : { maxHold: 20 }),
    ...(entryOptions.defaultInterval !== undefined
      ? { defaultInterval: entryOptions.defaultInterval }
      : { defaultInterval: 80 }),
    ...(entryOptions.defaultShowTime !== undefined
      ? { defaultShowTime: entryOptions.defaultShowTime }
      : { defaultShowTime: 4000 }),
    ...(entryOptions.defaultType !== undefined
      ? { defaultType: entryOptions.defaultType }
      : { defaultType: "info" }),
    checker: new Subject<ICheckerEventData>(),
  };

  const list = ref<IToast[]>([]);

  /**
   * Prune finished toasts from the list, keeping at most maxHold entries.
   * Called after each toast finishes to prevent unbounded memory growth.
   */
  const pruneFinished = () => {
    const finished = list.value.filter((item) => (item.status as any).value === "finished");
    if (finished.length > options.maxHold) {
      const toRemove = finished.slice(0, finished.length - options.maxHold);
      const removeIds = new Set(toRemove.map((t) => t.id));
      list.value = list.value.filter((item) => !removeIds.has(item.id));
    }
  };

  const makeToast = <ENTRY_TOAST extends IEntryToast>(
    entryToast: ENTRY_TOAST,
  ) => {
    return _makeToast(entryToast, options);
  };

  const show = <ENTRY_TOAST extends IEntryToast>(entryToast: ENTRY_TOAST) => {
    const createdToast = makeToast(entryToast);
    // @ts-ignore
    options.checker.next({
      eventType: "please_add_to_list",
      data: createdToast,
    });
  };

  options.checker.subscribe((observer) => {
    if (observer.eventType == "please_add_to_list") {
      // @ts-ignore
      list.value.push(observer.data);
      const activeItems = list.value.filter((item) => {
        return item.status == "active";
      });
      if (activeItems.length < options.maxShow) {
        options.checker.next({ eventType: "please_show", data: observer.data });
        observer.data.start();
      }
    }
    if (observer.eventType == "please_retry_show") {
      pruneFinished();
      const notStartedItems = list.value.filter((item) => {
        return item.status == "not-started";
      });
      const firstItem = _.first(notStartedItems);
      if (firstItem) {
        firstItem.start();
      }
    }

    if (observer.eventType == "please_save") {
      useAppToast().saveToastInHistory(observer.data);
    }
    if (observer.eventType == "please_delete_from_saved") {
      useAppToast().deleteToastFromHistory(observer.data);
    }
  });

  const activeList = computed(() => {
    return list.value.filter((item) => {
      return item.status == "active";
    });
  });
  const notStartedList = computed(() => {
    return list.value.filter((item) => {
      return item.status == "not-started";
    });
  });
  const finishedList = computed(() => {
    return list.value.filter((item) => {
      return item.status == "finished";
    });
  });
  return { show, activeList, notStartedList, finishedList };
};
