import type { ServiceWorkerGlobalScope } from "../self.types";
import { useLogger } from "../composables/log";
import { useSelf } from "../self";
import type { IAppSend, IWorkerSend } from "../messenger.types";
import { useWorkerMessanger } from "../composables/messenger/workerMessanger";

const _self = useSelf();
const { log } = useLogger("worker");
const messenger = useWorkerMessanger<IWorkerSend, IAppSend>();
const handler = () => {
  _self.addEventListener("activate", (e) => {
    e.waitUntil(
      _self.clients.claim().then(() => {
        log("activated successfully").show();
        messenger.sendToAll("worker_activated", {});
      }),
    );
  });
};

export default { handler };
