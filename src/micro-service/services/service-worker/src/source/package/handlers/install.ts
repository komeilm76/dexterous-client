import type { ServiceWorkerGlobalScope } from "../self.types";
import { useLogger } from "../composables/log";
import { useSelf } from "../self";
import { useWorkerMessanger } from "../composables/messenger/workerMessanger";
import type { IAppSend, IWorkerSend } from "../messenger.types";

const _self = useSelf();
const { log } = useLogger("worker");
const messenger = useWorkerMessanger<IWorkerSend, IAppSend>();
const handler = () => {
  _self.addEventListener("install", (e) => {
    e.waitUntil(
      _self.skipWaiting().then(() => {
        log("installed successfully").show();
        messenger.sendToAll("worker_installed", {});
      }),
    );
  });
};

export default { handler };
