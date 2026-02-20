import _ from "lodash";
import { Subject } from "rxjs";
import { v4 as uuidV4 } from "uuid";
import { computed, ref, watch } from "vue";
import z from "zod";
import { useCountdown } from "@vueuse/core";
import { useAppToast } from "@/stores/application/toast";
import tools from "@/tools";

const toastType = z.literal(["success", "info", "error", "warning"]);

const locationSchema = z.object({
  x: z.enum(["left", "right", "center"]),
  y: z.enum(["top", "bottom", "center"]),
});

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
});

type IEntryToast = z.infer<typeof entryToast>;
export type IToast = ReturnType<typeof _makeToast<IEntryToast>>;

const _makeToast = <ENTRY_TOAST extends IEntryToast>(
  entryToast: ENTRY_TOAST,
  options: IToastServiceOptions,
) => {
  const showTime = entryToast.showTime || options.defaultShowTime;

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

    const output = {
      task: () => {
        element?.entryTask({
          setLoadingValue: (v) => {
            loading.value = v;
          },
          pause:pause,
          resume:resume,
          stop:stop
        });
      },
      variant: element?.variant || "elevated",
      label: element?.label || "label is required",
      loading,
    };
    // @ts-ignore
    outputActions[key] = output;
  }

  const data = {
    ...entryToast,
    id: uuidV4(),
    createdOn: new Date(),
    actions: outputActions,
    saveToastInHistory: () => {
      saveStatus.value = true;
      options.checker.next({ eventType: "please_save", data: output });
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
  };

  const status = ref<"not-started" | "active" | "finished">("not-started");
  const saveStatus = ref<boolean>(false);
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
  const {
    start: _start,
    stop: _stop,
    remaining,
    pause,
    resume,
    isActive,
  } = useCountdown(data.showTime / options.defaultInterval, {
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
  const stop = () => {
    status.value = "finished";
    _stop();
    options.checker.next({ eventType: "please_retry_show" });
  };

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

// type IOutputToast = z.infer<typeof outputSchema>;

// type IToastActionOutout = {
//   label: string;
//   task: () => void;
//   loading: ReturnType<typeof ref<boolean>>;
// };

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

export type IToastServiceOptions = {
  maxShow: number;
  defaultInterval: number;
  defaultShowTime: number;
  defaultType: z.infer<typeof toastType>;
  checker: Subject<ICheckerEventData>;
};

export const makeToastService = (
  entryOptions: Partial<IToastServiceOptions>,
) => {
  const options: IToastServiceOptions = {
    ...(entryOptions.maxShow !== undefined
      ? { maxShow: entryOptions.maxShow }
      : { maxShow: 4 }),
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

  console.log("options", options);

  const list = ref<IToast[]>([]);
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
    console.log("observer called", observer.eventType);

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
