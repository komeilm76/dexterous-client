import kmWorker from "km-worker";
import type { IMessage } from "../../messenger.types";

export const useAppMessanger = <
  SEND_MESSAGE extends IMessage<SEND_TYPE, SEND_DATA>,
  RECEIVED_MESSAGE extends IMessage<RECEIVED_TYPE, RECEIVED_DATA>,
  SEND_TYPE extends string = string,
  SEND_DATA extends any = any,
  RECEIVED_TYPE extends string = string,
  RECEIVED_DATA extends any = any,
>(
  serviceWorker: ServiceWorkerRegistration,
) => {
  const send = <T extends keyof SEND_MESSAGE, D extends SEND_MESSAGE[T]>(
    type: T,
    data: D,
  ) => {
    serviceWorker.active?.postMessage({ [type]: data });
  };
  const listen = <
    T extends keyof RECEIVED_MESSAGE,
    D extends RECEIVED_MESSAGE[T],
  >(
    type: T,
    cb: (e: { data: D }) => void,
  ) => {
    navigator.serviceWorker.addEventListener("message", (event) => {
      const { data } = event as unknown as { data: RECEIVED_MESSAGE };
      const events = Object.keys(data) as (keyof RECEIVED_MESSAGE)[];
      if (events.includes(type)) {
        cb({ data: data[type] as D });
      }
    });
  };
  return { send, listen };
};

self;
