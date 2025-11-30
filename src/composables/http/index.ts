import { createAlova } from "alova";
import { axiosRequestAdapter } from "@alova/adapter-axios";
import vueHook from "alova/vue";
import {
  useFetcher,
  useForm,
  usePagination,
  useRequest,
  useWatcher,
} from "alova/client";

const http = createAlova({
  requestAdapter: axiosRequestAdapter(),
  baseURL: import.meta.env.VITE_API_BASE_URL,
  statesHook: vueHook,
  beforeRequest(request) {
    if (request.meta?.auth == "YES") {
    }
  },
});

export const useHttp = () => {
  return {
    http,
    hook: {
      useFetcher,
      useForm,
      useWatcher,
      usePagination,
      useRequest,
    },
  };
};
