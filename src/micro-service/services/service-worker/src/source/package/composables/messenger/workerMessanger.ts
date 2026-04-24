import kmWorker from "km-worker";
import type { IMessage } from "../../messenger.types";
import { useSelf } from "../../self";

export const useWorkerMessanger = <
  SEND_MESSAGE extends IMessage<SEND_TYPE, SEND_DATA>,
  RECEIVED_MESSAGE extends IMessage<RECEIVED_TYPE, RECEIVED_DATA>,
  SEND_TYPE extends string = string,
  SEND_DATA extends any = any,
  RECEIVED_TYPE extends string = string,
  RECEIVED_DATA extends any = any,
>() => {
  const _self = useSelf();
  const send = async <T extends keyof SEND_MESSAGE, D extends SEND_MESSAGE[T]>(
    clientId: string,
    type: T,
    data: D,
  ) => {
    const client = await _self.clients.get(clientId);
    if (client) {
      client.postMessage({ [type]: data });
    }
  };
  const sendToAll = async <
    T extends keyof SEND_MESSAGE,
    D extends SEND_MESSAGE[T],
  >(
    type: T,
    data: D,
  ) => {
    const clientList = await _self.clients.matchAll();
    for await (const client of clientList) {
      client.postMessage({ [type]: data });
    }
  };
  const listen = <
    T extends keyof RECEIVED_MESSAGE,
    D extends RECEIVED_MESSAGE[T],
  >(
    type: T,
    cb: (e: { data: D }) => void,
  ) => {
    _self.addEventListener("message", (event) => {
      const { data } = event;
      const events = Object.keys(data) as (keyof RECEIVED_MESSAGE)[];
      if (events.includes(type)) {
        cb({ data: data[type] as D });
      }
    });
  };
  return { send, sendToAll, listen };
};
