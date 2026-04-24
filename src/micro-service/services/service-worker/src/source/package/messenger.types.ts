export type IMessage<TYPE extends string, DATA extends any> = Record<
  TYPE,
  DATA
>;

type IAppVersion = string;
type IBuildHash = string;

export type IWorkerSend = IMessage<"worker_updated", { reload: boolean }> &
  IMessage<"worker_installed", {}> &
  IMessage<"worker_activated", {}> &
  IMessage<"worker_ready", {}> &
  IMessage<"cache_cleared", string>;

export type IAppSend = IMessage<
  "update_worker",
  `${IAppVersion}_${IBuildHash}`
> &
  IMessage<"clear_cache", string>;
