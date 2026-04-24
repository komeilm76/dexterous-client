// Minimal PushMessageData and WindowClient interfaces
interface PushMessageData {
  arrayBuffer(): Promise<ArrayBuffer>;
  blob(): Promise<Blob>;
  json(): Promise<any>;
  text(): Promise<string>;
}

interface WindowClient extends Client {
  readonly focused: boolean;
  readonly visibilityState: string;
  focus(): Promise<WindowClient>;
  navigate(url: string): Promise<WindowClient | null>;
}

// Minimal Service Worker type definitions
interface ExtendableEvent extends Event {
  waitUntil(f: Promise<any>): void;
  source: WindowClient;
}

interface FetchEvent extends ExtendableEvent {
  readonly request: Request;
  respondWith(r: Response | Promise<Response>): void;
}

interface ExtendableMessageEvent extends Omit<MessageEvent, "source"> {
  waitUntil(f: Promise<any>): void;
  source: WindowClient;
}

interface NotificationEvent extends ExtendableEvent {
  readonly notification: Notification;
  readonly action?: string;
}

interface PushEvent extends ExtendableEvent {
  readonly data?: PushMessageData;
}

interface PushSubscriptionChangeEvent extends ExtendableEvent {
  readonly newSubscription?: PushSubscription;
  readonly oldSubscription?: PushSubscription;
}

interface SyncEvent extends ExtendableEvent {
  readonly tag: string;
  readonly lastChance?: boolean;
}

interface Client {
  readonly frameType: string;
  readonly id: string;
  readonly type: string;
  readonly url: string;
  postMessage(message: any, transfer?: Transferable[]): void;
}

interface Clients {
  claim(): Promise<void>;
  get(id: string): Promise<Client | undefined>;
  matchAll(options?: {
    includeUncontrolled?: boolean;
    type?: string;
  }): Promise<Client[]>;
  openWindow(url: string): Promise<WindowClient | null>;
}

export interface ServiceWorkerGlobalScope {
  readonly clients: Clients;
  readonly registration: ServiceWorkerRegistration;
  readonly serviceWorker: ServiceWorker;
  readonly caches: CacheStorage;
  skipWaiting(): Promise<void>;

  // Event handlers
  onactivate:
    | ((this: ServiceWorkerGlobalScope, ev: ExtendableEvent) => any)
    | null;
  onfetch: ((this: ServiceWorkerGlobalScope, ev: FetchEvent) => any) | null;
  oninstall:
    | ((this: ServiceWorkerGlobalScope, ev: ExtendableEvent) => any)
    | null;
  onmessage:
    | ((this: ServiceWorkerGlobalScope, ev: ExtendableMessageEvent) => any)
    | null;
  onnotificationclick:
    | ((this: ServiceWorkerGlobalScope, ev: NotificationEvent) => any)
    | null;
  onnotificationclose:
    | ((this: ServiceWorkerGlobalScope, ev: NotificationEvent) => any)
    | null;
  onpush: ((this: ServiceWorkerGlobalScope, ev: PushEvent) => any) | null;
  onpushsubscriptionchange:
    | ((this: ServiceWorkerGlobalScope, ev: PushSubscriptionChangeEvent) => any)
    | null;
  onsync: ((this: ServiceWorkerGlobalScope, ev: SyncEvent) => any) | null;

  // EventTarget methods
  addEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
    type: K,
    listener: (
      this: ServiceWorkerGlobalScope,
      ev: ServiceWorkerGlobalScopeEventMap[K],
    ) => any,
    options?: boolean | AddEventListenerOptions,
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void;
  removeEventListener<K extends keyof ServiceWorkerGlobalScopeEventMap>(
    type: K,
    listener: (
      this: ServiceWorkerGlobalScope,
      ev: ServiceWorkerGlobalScopeEventMap[K],
    ) => any,
    options?: boolean | EventListenerOptions,
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void;
  dispatchEvent(event: Event): boolean;
}

// Event map for all service worker events
interface ServiceWorkerGlobalScopeEventMap {
  activate: ExtendableEvent;
  fetch: FetchEvent;
  install: ExtendableEvent;
  message: ExtendableMessageEvent;
  messageerror: MessageEvent;
  notificationclick: NotificationEvent;
  notificationclose: NotificationEvent;
  push: PushEvent;
  pushsubscriptionchange: PushSubscriptionChangeEvent;
  sync: SyncEvent;
}
