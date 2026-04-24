import kmWorker from "km-worker";
import type { IMessage } from "../../messenger.types";
import { useSelf } from "../../self";

export const useWorkerMessanger = <
  MESSAGE extends IMessage<TYPE, DATA>,
  TYPE extends string = string,
  DATA extends any = any,
>() => {
  const _self = useSelf();
  const send = async <T extends keyof MESSAGE, D extends MESSAGE[T]>(
    clientId: string,
    type: T,
    data: D,
  ) => {
    const client = await _self.clients.get(clientId);
    if (client) {
      client.postMessage({ [type]: data });
    }
  };
  const listen = <T extends keyof MESSAGE, D extends MESSAGE[T]>(
    type: T,
    cb: (e: D) => void,
  ) => {
    return kmWorker.inWorker.event({
      name: "message",
      action(_event) {
        const { data } = _event as unknown as { data: MESSAGE };
        const events = Object.keys(data) as (keyof MESSAGE)[];
        if (events.includes(type)) {
          cb(data[type] as D);
        }
      },
    });
  };
  return { send, listen };
};
