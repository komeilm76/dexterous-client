/**
 * @file toast.standalone.ts
 * @description Framework-agnostic toast notification service for TypeScript projects.
 * Works with Angular, React, Vue, or plain TypeScript/JavaScript.
 *
 * Dependencies: rxjs, uuid, lodash, zod
 *
 * @example — Basic usage
 * ```ts
 * import { makeToastService } from './toast.standalone'
 *
 * const toast = makeToastService()
 *
 * toast.show({ title: 'Welcome!', type: 'info' })
 * toast.events$.subscribe((e) => console.log(e))
 * ```
 *
 * @example — With global saved-toast store
 * ```ts
 * const toast = makeToastService({
 *   onSave:   (t) => myStore.saved.push(t),
 *   onDelete: (id) => myStore.saved = myStore.saved.filter(t => t.id !== id),
 * })
 * ```
 *
 * @example — Subscribing to reactive list updates (React / Angular)
 * ```ts
 * toast.activeList$.subscribe((toasts) => {
 *   setToasts(toasts) // React setState
 * })
 * ```
 */

import _ from "lodash";
import { BehaviorSubject, Subject } from "rxjs";
import { map, distinctUntilChanged } from "rxjs/operators";
import { v4 as uuidV4 } from "uuid";
import z from "zod";

// ---------------------------------------------------------------------------
// Schemas & Types
// ---------------------------------------------------------------------------

/** Allowed toast notification types. */
const toastTypeSchema = z.enum(["success", "info", "error", "warning"]);

/** Allowed horizontal positions for a toast. */
const xPositionSchema = z.enum(["left", "right", "center"]);

/** Allowed vertical positions for a toast. */
const yPositionSchema = z.enum(["top", "bottom", "center"]);

/** Screen position of a toast notification. */
const locationSchema = z.object({
  x: xPositionSchema,
  y: yPositionSchema,
});

/**
 * Schema for an action button inside a toast notification.
 * The callback receives timer control helpers so the action can
 * pause/resume/stop the auto-dismiss countdown.
 */
const toastActionSchema = z.object({
  /** Button label text. */
  label: z.string(),
  /**
   * Optional variant hint for UI libraries (e.g. Vuetify, MUI button variants).
   * Your rendering layer is free to interpret or ignore this.
   */
  variant: z
    .enum(["elevated", "flat", "outlined", "plain", "text", "tonal"])
    .optional(),
  /**
   * Callback invoked when the user clicks this action.
   * @param controls - Timer and loading-state helpers.
   */
  entryTask: z.function({
    input: [
      z.object({
        /** Manually toggle the button's loading/spinner state. */
        setLoadingValue: z.function({ input: [z.boolean()] }),
        /** Pause the auto-dismiss countdown. */
        pause: z.function(),
        /** Resume a paused countdown. */
        resume: z.function(),
        /** Immediately dismiss the toast. */
        stop: z.function(),
      }),
    ],
  }),
});

/**
 * Input schema for creating a new toast.
 * Only `title` is required; all other fields fall back to service defaults.
 */
const entryToastSchema = z.object({
  /** Primary heading shown in the toast. */
  title: z.string(),
  /** Optional list of detail messages (may be delayed by `showMessageDelay`). */
  messages: z.string().array().optional(),
  /** Named action buttons keyed by a unique identifier. */
  actions: z.record(z.string(), toastActionSchema).optional(),
  /** Screen position override. Defaults to `{ x: 'right', y: 'bottom' }`. */
  location: locationSchema.partial().optional(),
  /** Custom background color (any CSS value). */
  color: z.string().optional(),
  /** Semantic type that controls icon/color theming in the UI. */
  type: toastTypeSchema.optional(),
  /** How long (ms) to display the toast. Overrides the service default. */
  showTime: z.number().optional(),
  /** Delay (ms) before `messages` are revealed. 0 means immediate. */
  showMessageDelay: z.number().optional(),
});

/** Input type for creating a toast. */
export type IEntryToast = z.infer<typeof entryToastSchema>;

/** Possible lifecycle states for a toast. */
export type ToastStatus = "not-started" | "active" | "finished";

/** A resolved action button on a toast instance. */
export type IResolvedAction = {
  /** Unique key from the entry actions record. */
  key: string;
  /** Button label. */
  label: string;
  /** Variant hint for the UI layer. */
  variant: string;
  /** Invoke the action's task. */
  task: () => void;
  /** Observable boolean – true while the action task is running. */
  loading$: BehaviorSubject<boolean>;
};

/** The fully resolved, immutable-data portion of a toast instance. */
export type IToastData = {
  id: string;
  createdOn: Date;
  title: string;
  messages: string[];
  actions: Record<string, IResolvedAction>;
  location: { x: string; y: string };
  color?: string;
  type: z.infer<typeof toastTypeSchema>;
  showTime: number;
  showMessageDelay: number;
};

/**
 * A fully constructed toast instance.
 * Observables are used in place of Vue refs so this works in any framework.
 */
export type IToast = IToastData & {
  // --- Observables ---
  /** Emits the current lifecycle status. */
  status$: BehaviorSubject<ToastStatus>;
  /** Emits `true` after `showMessageDelay` ms once the toast becomes active. */
  canShowMessageList$: BehaviorSubject<boolean>;
  /** Emits `true` when this toast has been saved to history. */
  isSaved$: BehaviorSubject<boolean>;
  /**
   * Emits remaining display time as a percentage (100 → 0).
   * Useful for a progress bar.
   */
  remainingPercent$: BehaviorSubject<number>;
  /** Emits the remaining countdown ticks. */
  remaining$: BehaviorSubject<number>;

  // --- Controls ---
  /** Start the toast (called automatically by the service). */
  start: () => void;
  /** Immediately dismiss the toast. */
  stop: () => void;
  /** Pause the auto-dismiss countdown. */
  pause: () => void;
  /** Resume a paused countdown. */
  resume: () => void;

  // --- History ---
  /** Mark the toast as saved and emit a save event. */
  saveToastInHistory: () => void;
  /** Remove the toast from history and emit a delete event. */
  deleteToastFromHistory: () => void;
};

// ---------------------------------------------------------------------------
// Internal event bus types
// ---------------------------------------------------------------------------

type CheckerEvent =
  | { eventType: "please_add_to_list"; data: IToast }
  | { eventType: "please_show"; data: IToast }
  | { eventType: "please_retry_show" }
  | { eventType: "please_hide"; data: IToast }
  | { eventType: "please_save"; data: IToast }
  | { eventType: "please_delete_from_saved"; data: string };

// ---------------------------------------------------------------------------
// Service configuration
// ---------------------------------------------------------------------------

/**
 * Configuration for `makeToastService`. All fields are optional.
 */
export type IToastServiceOptions = {
  /** Maximum number of toasts shown at once. Default: `4`. */
  maxShow?: number;
  /**
   * Countdown tick interval in ms. Controls how often `remainingPercent$`
   * updates (smaller = smoother progress bar). Default: `80`.
   */
  defaultInterval?: number;
  /**
   * Default visible duration (ms) for toasts that don't specify `showTime`.
   * Default: `4000`.
   */
  defaultShowTime?: number;
  /**
   * Fallback toast type for toasts that don't specify `type`.
   * Default: `'info'`.
   */
  defaultType?: z.infer<typeof toastTypeSchema>;
  /**
   * Called when a toast's `saveToastInHistory()` is invoked.
   * Use this to push the toast into your global store.
   */
  onSave?: (toast: IToast) => void;
  /**
   * Called when a toast's `deleteToastFromHistory()` is invoked.
   * Use this to remove the toast from your global store.
   */
  onDelete?: (toastId: string) => void;
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Resolves the final screen position from a partial location override.
 *
 * @param location - Optional partial location from the entry toast.
 * @returns A fully specified `{ x, y }` position.
 */
function resolveLocation(location: IEntryToast["location"]): {
  x: string;
  y: string;
} {
  return {
    x: location?.x ?? "right",
    y: location?.y ?? "bottom",
  };
}

/**
 * Creates a precise, clearable interval-based countdown.
 * Returns helpers to start, stop, pause, and resume the timer.
 *
 * @param totalMs       - Total duration in milliseconds.
 * @param intervalMs    - Tick interval in milliseconds.
 * @param onTick        - Invoked on every tick with the remaining tick count.
 * @param onComplete    - Invoked when the countdown reaches zero.
 * @returns Timer controls.
 */
function createCountdown(
  totalMs: number,
  intervalMs: number,
  onTick: (remaining: number) => void,
  onComplete: () => void,
) {
  const totalTicks = Math.round(totalMs / intervalMs);
  let remaining = totalTicks;
  let timerId: ReturnType<typeof setInterval> | null = null;
  let paused = false;

  const clear = () => {
    if (timerId !== null) {
      clearInterval(timerId);
      timerId = null;
    }
  };

  const tick = () => {
    if (paused) return;
    remaining -= 1;
    onTick(remaining);
    if (remaining <= 0) {
      clear();
      onComplete();
    }
  };

  const start = () => {
    remaining = totalTicks;
    clear();
    timerId = setInterval(tick, intervalMs);
    onTick(remaining);
  };

  const stop = () => {
    remaining = 0;
    clear();
  };

  const pause = () => {
    paused = true;
  };

  const resume = () => {
    paused = false;
  };

  return {
    start,
    stop,
    pause,
    resume,
    getRemaining: () => remaining,
    totalTicks,
  };
}

// ---------------------------------------------------------------------------
// Core toast factory (internal)
// ---------------------------------------------------------------------------

/**
 * Constructs a fully reactive toast instance from an entry payload.
 *
 * @param entry   - Validated toast entry data.
 * @param options - Resolved service configuration.
 * @param checker - Internal event bus.
 * @returns       A reactive `IToast` instance.
 *
 * @internal Use `makeToastService().show(...)` instead of calling this directly.
 */
function buildToast(
  entry: IEntryToast,
  options: Required<Omit<IToastServiceOptions, "onSave" | "onDelete">>,
  optionalHooks: {
    onSave?: IToastServiceOptions["onSave"];
    onDelete?: IToastServiceOptions["onDelete"];
  },
  checker: Subject<CheckerEvent>,
): IToast {
  const showTime = entry.showTime ?? options.defaultShowTime;
  const showMessageDelay = entry.showMessageDelay ?? 0;

  // ---- Observables -------------------------------------------------------
  const status$ = new BehaviorSubject<ToastStatus>("not-started");
  const canShowMessageList$ = new BehaviorSubject<boolean>(false);
  const isSaved$ = new BehaviorSubject<boolean>(false);
  const remaining$ = new BehaviorSubject<number>(0);
  const remainingPercent$ = new BehaviorSubject<number>(100);

  // ---- Countdown ---------------------------------------------------------
  const countdown = createCountdown(
    showTime,
    options.defaultInterval,
    (rem) => {
      remaining$.next(rem);
      remainingPercent$.next(
        Number(((rem * options.defaultInterval * 100) / showTime).toFixed(1)),
      );
    },
    () => {
      status$.next("finished");
      checker.next({ eventType: "please_retry_show" });
    },
  );

  // ---- Controls ----------------------------------------------------------
  let showMessageTimer: ReturnType<typeof setTimeout> | null = null;

  /** Start displaying the toast and begin its countdown. */
  const start = () => {
    status$.next("active");
    countdown.start();
    remaining$.next(countdown.totalTicks);
    remainingPercent$.next(100);

    // Reveal detail messages after configured delay
    if (showMessageDelay > 0) {
      showMessageTimer = setTimeout(() => {
        canShowMessageList$.next(true);
      }, showMessageDelay);
    } else {
      canShowMessageList$.next(true);
    }
  };

  /** Immediately dismiss the toast. */
  const stop = () => {
    if (showMessageTimer !== null) clearTimeout(showMessageTimer);
    countdown.stop();
    status$.next("finished");
    checker.next({ eventType: "please_retry_show" });
  };

  /** Pause the auto-dismiss countdown. */
  const pause = () => countdown.pause();

  /** Resume the auto-dismiss countdown. */
  const resume = () => countdown.resume();

  // ---- Actions -----------------------------------------------------------
  const resolvedActions: Record<string, IResolvedAction> = {};

  for (const [key, actionEntry] of Object.entries(entry.actions ?? {})) {
    const loading$ = new BehaviorSubject<boolean>(false);

    resolvedActions[key] = {
      key,
      label: actionEntry.label,
      variant: actionEntry.variant ?? "elevated",
      loading$,
      task: () => {
        actionEntry.entryTask({
          setLoadingValue: (v) => loading$.next(v),
          pause,
          resume,
          stop,
        });
      },
    };
  }

  // ---- History -----------------------------------------------------------

  /** Save this toast to history. Triggers `onSave` hook. */
  const saveToastInHistory = () => {
    isSaved$.next(true);
    checker.next({ eventType: "please_save", data: toast });
  };

  /** Remove this toast from history. Triggers `onDelete` hook. */
  const deleteToastFromHistory = () => {
    isSaved$.next(false);
    checker.next({ eventType: "please_delete_from_saved", data: toast.id });
  };

  // ---- Assembled toast ---------------------------------------------------
  const toast: IToast = {
    // static data
    id: uuidV4(),
    createdOn: new Date(),
    title: entry.title,
    messages: entry.messages ?? [],
    actions: resolvedActions,
    location: resolveLocation(entry.location),
    color: entry.color,
    type: entry.type ?? options.defaultType,
    showTime,
    showMessageDelay,
    // observables
    status$,
    canShowMessageList$,
    isSaved$,
    remaining$,
    remainingPercent$,
    // controls
    start,
    stop,
    pause,
    resume,
    // history
    saveToastInHistory,
    deleteToastFromHistory,
  };

  return toast;
}

// ---------------------------------------------------------------------------
// Global saved-toast store (optional, standalone)
// ---------------------------------------------------------------------------

/**
 * A lightweight, framework-agnostic store for persisting saved toasts.
 * You can use this as a simple singleton or integrate it with your own
 * state management solution via the `onSave` / `onDelete` service hooks.
 */
export class ToastHistoryStore {
  /** BehaviorSubject holding the current list of saved toasts. */
  readonly savedToasts$ = new BehaviorSubject<IToast[]>([]);

  /**
   * Save a toast to history.
   * @param toast - The toast instance to save.
   */
  save(toast: IToast): void {
    const current = this.savedToasts$.getValue();
    const alreadySaved = current.some((t) => t.id === toast.id);
    if (!alreadySaved) {
      this.savedToasts$.next([...current, toast]);
    }
  }

  /**
   * Remove a saved toast by its ID.
   * @param toastId - The UUID of the toast to remove.
   */
  delete(toastId: string): void {
    const current = this.savedToasts$.getValue();
    this.savedToasts$.next(current.filter((t) => t.id !== toastId));
  }

  /**
   * Get a snapshot of the current saved toasts list.
   * @returns An array of saved `IToast` instances.
   */
  getAll(): IToast[] {
    return this.savedToasts$.getValue();
  }

  /**
   * Find a saved toast by its ID.
   * @param toastId - The UUID to look up.
   * @returns The matching toast, or `undefined` if not found.
   */
  findById(toastId: string): IToast | undefined {
    return this.savedToasts$.getValue().find((t) => t.id === toastId);
  }

  /** Clear all saved toasts. */
  clear(): void {
    this.savedToasts$.next([]);
  }
}

// ---------------------------------------------------------------------------
// Public service factory
// ---------------------------------------------------------------------------

/**
 * The object returned by `makeToastService`.
 */
export type IToastService = {
  /**
   * Create and queue (or immediately show) a new toast notification.
   *
   * @param entry - Toast payload. Only `title` is required.
   *
   * @example
   * ```ts
   * toast.show({
   *   title: 'File deleted',
   *   type: 'error',
   *   messages: ['The operation could not be completed.'],
   *   actions: {
   *     undo: {
   *       label: 'Undo',
   *       variant: 'text',
   *       entryTask: ({ stop }) => { undoDelete(); stop() },
   *     },
   *   },
   * })
   * ```
   */
  show: (entry: IEntryToast) => void;

  /**
   * Observable list of toasts currently visible on screen.
   * Subscribe to re-render your toast container on changes.
   */
  activeList$: BehaviorSubject<IToast[]>;

  /**
   * Observable list of toasts waiting in the queue.
   */
  notStartedList$: BehaviorSubject<IToast[]>;

  /**
   * Observable list of dismissed toasts.
   * Useful for keeping a session log.
   */
  finishedList$: BehaviorSubject<IToast[]>;

  /**
   * All events emitted by the internal checker bus.
   * Subscribe for fine-grained control (e.g. enter/leave animation hooks).
   */
  events$: Subject<CheckerEvent>;

  /**
   * Manually dismiss a toast by its ID.
   * Equivalent to calling `toast.stop()` on the instance.
   *
   * @param toastId - The UUID of the toast to dismiss.
   */
  dismiss: (toastId: string) => void;

  /**
   * Dismiss all currently active and queued toasts immediately.
   */
  dismissAll: () => void;
};

/**
 * Creates a fully functional, framework-agnostic toast notification service.
 *
 * Internally uses RxJS `BehaviorSubject` so consumers can subscribe to
 * reactive list updates from any framework (React, Angular, plain TS, etc.).
 *
 * @param options - Optional configuration overrides.
 * @returns        A `IToastService` object.
 *
 * @example — React
 * ```tsx
 * const toastService = makeToastService({ maxShow: 3 })
 *
 * function ToastContainer() {
 *   const [toasts, setToasts] = useState<IToast[]>([])
 *   useEffect(() => {
 *     const sub = toastService.activeList$.subscribe(setToasts)
 *     return () => sub.unsubscribe()
 *   }, [])
 *   return <>{toasts.map(t => <Toast key={t.id} toast={t} />)}</>
 * }
 * ```
 *
 * @example — Angular
 * ```ts
 * @Injectable({ providedIn: 'root' })
 * export class ToastFacade {
 *   readonly service = makeToastService()
 *   readonly active$ = this.service.activeList$
 * }
 * ```
 *
 * @example — With global history store
 * ```ts
 * const history = new ToastHistoryStore()
 * const toast = makeToastService({
 *   onSave:   (t) => history.save(t),
 *   onDelete: (id) => history.delete(id),
 * })
 * history.savedToasts$.subscribe(console.log)
 * ```
 */
export function makeToastService(
  options: IToastServiceOptions = {},
): IToastService {
  // ---- Resolve options ---------------------------------------------------
  const resolved = {
    maxShow: options.maxShow ?? 4,
    defaultInterval: options.defaultInterval ?? 80,
    defaultShowTime: options.defaultShowTime ?? 4000,
    defaultType: options.defaultType ?? ("info" as const),
  };

  const optionalHooks = {
    onSave: options.onSave,
    onDelete: options.onDelete,
  };

  // ---- Internal state ----------------------------------------------------
  const allToasts: IToast[] = [];
  const checker = new Subject<CheckerEvent>();

  const activeList$ = new BehaviorSubject<IToast[]>([]);
  const notStartedList$ = new BehaviorSubject<IToast[]>([]);
  const finishedList$ = new BehaviorSubject<IToast[]>([]);

  // ---- List helpers ------------------------------------------------------

  /** Recompute and push updated lists to their subjects. */
  const syncLists = () => {
    activeList$.next(
      allToasts.filter((t) => t.status$.getValue() === "active"),
    );
    notStartedList$.next(
      allToasts.filter((t) => t.status$.getValue() === "not-started"),
    );
    finishedList$.next(
      allToasts.filter((t) => t.status$.getValue() === "finished"),
    );
  };

  /** Return the number of currently active (visible) toasts. */
  const activeCount = () =>
    allToasts.filter((t) => t.status$.getValue() === "active").length;

  /**
   * Subscribe to a toast's status changes so the lists stay in sync
   * whenever a toast moves from one state to another.
   */
  const watchToastStatus = (toast: IToast) => {
    toast.status$.subscribe(() => syncLists());
  };

  /**
   * Start the next queued toast if a display slot is available.
   */
  const tryShowNext = () => {
    const next = _.first(
      allToasts.filter((t) => t.status$.getValue() === "not-started"),
    );
    if (next) {
      checker.next({ eventType: "please_show", data: next });
      next.start();
    }
  };

  // ---- Event bus subscription --------------------------------------------
  checker.subscribe((event) => {
    switch (event.eventType) {
      case "please_add_to_list": {
        allToasts.push(event.data);
        watchToastStatus(event.data);
        syncLists();

        if (activeCount() < resolved.maxShow) {
          checker.next({ eventType: "please_show", data: event.data });
          event.data.start();
        }
        break;
      }

      case "please_retry_show": {
        tryShowNext();
        break;
      }

      case "please_save": {
        optionalHooks.onSave?.(event.data);
        break;
      }

      case "please_delete_from_saved": {
        optionalHooks.onDelete?.(event.data);
        break;
      }
    }
  });

  // ---- Public API --------------------------------------------------------

  const show = (entry: IEntryToast): void => {
    const validated = entryToastSchema.parse(entry);
    const toast = buildToast(validated, resolved, optionalHooks, checker);
    checker.next({ eventType: "please_add_to_list", data: toast });
  };

  const dismiss = (toastId: string): void => {
    const toast = allToasts.find((t) => t.id === toastId);
    toast?.stop();
  };

  const dismissAll = (): void => {
    for (const toast of allToasts) {
      if (toast.status$.getValue() !== "finished") {
        toast.stop();
      }
    }
  };

  return {
    show,
    activeList$,
    notStartedList$,
    finishedList$,
    events$: checker,
    dismiss,
    dismissAll,
  };
}
