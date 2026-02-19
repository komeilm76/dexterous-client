import _ from "lodash";
import { Subject } from "rxjs";
import { v4 as uuidV4 } from "uuid";
import { computed, ref } from "vue";
import z from "zod";
import { useCountdown } from "@vueuse/core";
import { useAppToast } from "@/stores/application/toast";

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
            }),
          ],
        }),
      }),
    )
    .optional(),
  color: z.string().optional(),
  type: z.literal(["success", "info", "error", "warning"]).optional(),
  showTime: z.number().optional(),
});

type IEntryToast = z.infer<typeof entryToast>;
// type IOutputToast = z.infer<typeof outputSchema>;

// type IToastActionOutout = {
//   label: string;
//   task: () => void;
//   loading: ReturnType<typeof ref<boolean>>;
// };

const recheck = new Subject<
  | {
      eventType: "please_add_to_list";
      data: ReturnType<typeof makeToast<IEntryToast>>;
    }
  | {
      eventType: "please_show";
      data: ReturnType<typeof makeToast<IEntryToast>>;
    }
  | { eventType: "please_retry_show" }
  | {
      eventType: "please_hide";
      data: ReturnType<typeof makeToast<IEntryToast>>;
    }
  | {
      eventType: "please_save";
      data: ReturnType<typeof makeToast<IEntryToast>>;
    }
  | {
      eventType: "please_delete_from_saved";
      data: ReturnType<typeof makeToast<IEntryToast>>["id"];
    }
>();
const maxShow: number = 4;
const list = ref<ReturnType<typeof makeToast>[]>([]);
const defaultInterval: number = 80;
const defaultShowTime: number = 4000;
const defaultType: z.infer<typeof entryToast.shape.type> = "info";
const makeToast = <ENTRY_TOAST extends IEntryToast>(
  entryToast: ENTRY_TOAST,
) => {
  const showTime = entryToast.showTime || defaultShowTime;

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
      recheck.next({ eventType: "please_save", data: output });
    },
    deleteToastFromHistory: () => {
      saveStatus.value = false;
      recheck.next({ eventType: "please_delete_from_saved", data: output.id });
    },
    // showTime
    showTime,
    // type
    ...(entryToast.type ? { type: entryToast.type } : { type: defaultType }),
    // messages
    ...(entryToast.messages
      ? { messages: entryToast.messages }
      : { messages: [] }),
  };

  const status = ref<"not-started" | "active" | "finished">("not-started");
  const saveStatus = ref<boolean>(false);
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
  } = useCountdown(data.showTime / defaultInterval, {
    onComplete() {
      status.value = "finished";
      recheck.next({ eventType: "please_retry_show" });
    },
    interval: defaultInterval,
  });

  const start = () => {
    status.value = "active";
    _start();
  };
  const stop = () => {
    status.value = "finished";
    _stop();
    recheck.next({ eventType: "please_retry_show" });
  };

  const remainingPercent = computed(() => {
    const totalTime = showTime;

    return ((remaining.value * defaultInterval * 100) / totalTime).toFixed();
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
    remainingPercent,
  };
  return output;
};

export type IToast = ReturnType<typeof makeToast>;
const show = <ENTRY_TOAST extends IEntryToast>(entryToast: ENTRY_TOAST) => {
  const createdToast = makeToast(entryToast);
  // @ts-ignore
  recheck.next({ eventType: "please_add_to_list", data: createdToast });
};

recheck.subscribe((observer) => {
  console.log("observer called", observer.eventType);

  if (observer.eventType == "please_add_to_list") {
    // @ts-ignore
    list.value.push(observer.data);
    const activeItems = list.value.filter((item) => {
      return item.status == "active";
    });
    if (activeItems.length < maxShow) {
      recheck.next({ eventType: "please_show", data: observer.data });
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

export const useToast = () => {
  return { show, list, activeList, notStartedList, finishedList };
};
