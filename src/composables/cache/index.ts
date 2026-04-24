import { useAppToast } from "@/stores/application/toast";
import { appStatus } from "@/stores/subjects";
import tools from "@/tools";
import { Subject } from "rxjs";
import { watch } from "vue";
import { ref } from "vue";

type IConfig = {
  onFinished: Function;
  onStarted: Function;
};

export const useCache = (entryConfig?: Partial<IConfig>) => {
  const config: IConfig = {
    onFinished: () => {},
    onStarted: () => {},
    ...(entryConfig ? entryConfig : {}),
  };
  const showCacheClearedMessage = () => {
    toast.service?.show({
      title: "Cache Cleared",
      messages: [
        "Cache Cleared In Background",
        "PLease Reload The Page Or Click Update Button",
        "Website Force Reload After a few Moments Later.",
        "This Operation Is Not At Your Discretion",
      ],
      canPause: true,
      closable: false,
      canSave: false,
      type: "warning",
      showTime: 30000,
      actions: {
        update: {
          label: "update",
          variant: "elevated",
          entryTask: ({ pause }) => {
            pause();
            window.location.reload();
          },
        },
      },
      onActivated: () => {
        appStatus.next({ disabled: true });
      },
      onFinished: () => {
        window.location.reload();
      },
    });
  };
  const showNewVersionMessage = () => {
    toast.service?.show({
      title: "New Version Avalable",
      messages: [
        "Updated successfully In Background",
        "PLease Reload The Page Or Click Update Button",
        "Website Force Reload After a few Moments Later.",
        "This Operation Is Not At Your Discretion",
      ],
      canPause: true,
      closable: false,
      canSave: false,
      type: "warning",
      showTime: 30000,
      actions: {
        update: {
          label: "update",
          variant: "elevated",
          entryTask: ({ pause }) => {
            pause();
            window.location.reload();
          },
        },
      },
      onActivated: () => {
        appStatus.next({ disabled: true });
      },
      onFinished: () => {
        window.location.reload();
      },
    });
  };
  const toast = useAppToast();
  const loading = ref(false);
  const finishChecker = new Subject<void>();
  const status = ref<"started" | "finished">("started");

  const clear = async () => {
    status.value = "started";
    loading.value = true;
    const cacheStorageKeys = await caches.keys();
    for await (const key of cacheStorageKeys) {
      await caches.delete(key);
    }
    await tools.time.wait(400);
    loading.value = false;
    status.value = "finished";
  };
  watch(status, (n, o) => {
    if (n == "started") {
      config.onStarted && config.onStarted();
    }
    if (n == "finished") {
      config.onFinished && config.onFinished();
    }
  });
  return {
    showCacheClearedMessage,
    showNewVersionMessage,
    loading,
    status,
    clear,
  };
};
