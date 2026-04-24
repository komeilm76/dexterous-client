import { useServiceWorker } from "./package";

const { handlers } = useServiceWorker();

handlers.install.handler();
handlers.activate.handler();
handlers.message.handler();
handlers._fetch.handler();
