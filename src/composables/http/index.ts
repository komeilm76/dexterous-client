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
import { useEnvs } from "../env";
import { useAppJwt } from "@/stores/application/jwt";

export const useHttp = () => {
  const { baseUrl } = useEnvs();
  const { token } = useAppJwt();
  const http = createAlova({
    requestAdapter: axiosRequestAdapter(),
    ...(baseUrl && { baseURL: baseUrl }),
    statesHook: vueHook,
    beforeRequest(request) {
      if (request.meta?.auth == "YES") {
        request.config.headers.Authorization = `Bearer ${token}`;
        // request.config.headers["Authorization"] =
        //   `Bearer ${useAppSetting().accessToken}`;
      }
    },
  });
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
