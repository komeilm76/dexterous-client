
import type { App } from "vue";
import { appStatus } from "@/stores/subjects";
import { useAppToast } from "@/stores/application/toast";
import { useLogger } from "@/micro-service/services/service-worker/src/source/package/composables/log";
import type { IAppSend, IWorkerSend } from "@/micro-service/services/service-worker/src/source/package/messenger.types";
import { useAppMessanger } from "@/micro-service/services/service-worker/src/source/package/composables/messenger/appMessanger";
import type { EnvConfig } from "@/micro-modules/env/types";

const { log } = useLogger("application/worker");

const install = async (envs: EnvConfig, app: App) => {
  const toaster = useAppToast();
  try {
    let sw =
      await navigator.serviceWorker.getRegistration("/service-worker.js");
    if (sw == undefined) {
      sw = await navigator.serviceWorker.register("/service-worker.js", {
        scope: "/",
        type: "module",
        updateViaCache: "all",
      });
      log("service worker registered successfully").show();
      toaster.service?.info({ title: "service worker installed" });
    } else {
      log("service worker loaded successfully").show();
    }
    const messenger = useAppMessanger<IAppSend, IWorkerSend>(sw);
    const cacheVersion = `${envs.appVersion}_${envs.buildHash}` as const;
    messenger.send("update_worker", cacheVersion);
    messenger.listen("worker_updated", (e) => {
      if (e.data.reload == true) {
        toaster.service?.show({
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
      }
    });
    sw.update();
  } catch (error) {
    log("Error on Install Service worker").show();
    console.error(error);
  }
};
export default { install };
