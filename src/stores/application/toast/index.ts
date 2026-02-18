import { useToast, type IToast } from "@/composables/toast-new";
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
>;

const clearToastForHistory = (toast: IToast): ICleanHistoryToast => {
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
    ...rest
  } = toast;
  return rest;
};

export const useAppToast = defineStore(
  "app_toast",
  () => {
    const toasts = ref<ICleanHistoryToast[]>([]);
    const saveToastInHistory = (toast: IToast) => {
      const clearToast = clearToastForHistory(toast);
      const findedToasts = toasts.value.filter((item) => {
        return item.id == toast.id;
      });
      if (findedToasts.length == 0) {
        toasts.value.push(clearToast);
      }
    };
    const getSavedToast = () => {
      return toasts.value;
    };
    return { toasts, saveToastInHistory, getSavedToast };
  },
  {
    persist: {
      omit: [],
      //   serializer: {
      //     deserialize: parse,
      //     serialize: stringify,
      //   },
    },
  },
);
