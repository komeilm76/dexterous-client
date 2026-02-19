import { makeToastService, type IToast } from "@/composables/toast-new";
import _ from "lodash";
import { defineStore } from "pinia";
import { ref } from "vue";
import { parse, stringify } from "zipson";

type ICleanHistoryToast = Omit<
  IToast,
  | "start"
  | "stop"
  | "pause"
  | "resume"
  | "remaining"
  | "isActive"
  | "status"
  | "remainingPercent"
  | "saveToastInHistory"
  | "isSaved"
  | "canShowMessageList"
>;

const clearToastForHistory = (toast: IToast): ICleanHistoryToast => {
  const clonedToast = { ...toast };
  const clearedActions = {} as Record<
    string,
    {
      label: string;
      variant?:
        | "elevated"
        | "flat"
        | "outlined"
        | "plain"
        | "text"
        | "tonal"
        | undefined;
    }
  >;
  for (const key in clonedToast.actions) {
    const element = toast.actions[key];
    if (element) {
      const { entryTask, loading, task, ...rest } = element;
      clearedActions[key] = rest;
    }
  }
  // @ts-ignore
  clonedToast.actions = clearedActions;
  const {
    start,
    stop,
    pause,
    resume,
    remaining,
    isActive,
    status,
    remainingPercent,
    saveToastInHistory,
    isSaved,
    canShowMessageList,
    ...rest
  } = clonedToast;
  return rest;
};

export const useAppToast = defineStore(
  "app_toast",
  () => {
    let service = ref<ReturnType<typeof makeToastService>>();
    const toasts = ref<ICleanHistoryToast[]>([]);
    const saveToastInHistory = (toast: IToast) => {
      const clearToast = clearToastForHistory(toast);
      const findedToasts = toasts.value.filter((item) => {
        return item.id == clearToast.id;
      });
      if (findedToasts.length == 0) {
        toasts.value.push(clearToast);
      }
    };
    const deleteToastFromHistory = (toastId: IToast["id"]) => {
      const findedToasts = toasts.value.filter((item) => {
        return item.id !== toastId;
      });
      toasts.value = findedToasts;
    };
    const getSavedToast = () => {
      return toasts.value;
    };
    const registerService = (
      entryService: ReturnType<typeof makeToastService>,
    ) => {
      service.value = entryService;
    };
    return {
      service,
      toasts,
      saveToastInHistory,
      getSavedToast,
      deleteToastFromHistory,
      registerService,
    };
  },
  {
    persist: {
      omit: ["service"],
      serializer: {
        deserialize: parse,
        serialize: stringify,
      },
    },
  },
);
