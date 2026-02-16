import { computed, ref, watch, watchEffect } from "vue";

type IProgressStatus = "not-started" | "in-progress" | "finished" | "failed";

const loadingMount = ref<IProgressStatus>("not-started");
const loadingEnvs = ref<IProgressStatus>("not-started");
const loadingPinia = ref<IProgressStatus>("not-started");
const loadingRouter = ref<IProgressStatus>("not-started");
const loadingtailwind = ref<IProgressStatus>("not-started");
const loadingVuetify = ref<IProgressStatus>("not-started");
const loadingmotion = ref<IProgressStatus>("not-started");
const loadingIcon = ref<IProgressStatus>("not-started");

const wait = async (time: number) => {
  return new Promise((rs, rj) => {
    setTimeout(async () => {
      rs(true);
    }, time);
  });
};

export const useAppLoading = (
  loadings: Record<string, ReturnType<typeof ref<IProgressStatus>>>,
) => {
  const reactivityLazyListOfLoading = ref<IProgressStatus[]>([]);
  const listOfLoadings = computed(() => {
    return Object.entries(loadings).map((item) => {
      return { value: item["1"].value, key: item["0"] };
    });
  });

  const remainingItems = ref<
    {
      value: IProgressStatus | undefined;
      key: string;
    }[]
  >();
  const finishedItems = ref<
    {
      value: IProgressStatus | undefined;
      key: string;
    }[]
  >();
  const failedItems = ref<
    {
      value: IProgressStatus | undefined;
      key: string;
    }[]
  >();

  watch(listOfLoadings, async () => {
    await wait(100);
    remainingItems.value = listOfLoadings.value.filter((item) => {
      return item.value == "not-started" || item.value == "in-progress";
    });
    finishedItems.value = listOfLoadings.value.filter((item) => {
      return item.value == "finished";
    });
    failedItems.value = listOfLoadings.value.filter((item) => {
      return item.value == "failed";
    });
  });

  const loading = computed(() => {
    const total = listOfLoadings.value;
    const totalCount = total.length;
    const remaining = remainingItems.value;
    const remainingCount = remaining?.length as number;
    const remainingPercent = (remainingCount * 100) / totalCount;
    const finished = finishedItems.value;
    const finishedCount = finished?.length as number;
    const finishedPercent = (finishedCount * 100) / totalCount || 0;
    const failed = failedItems.value;
    const failedCount = failed?.length as number;
    const failedPercent = (failedCount * 100) / totalCount;
    return {
      // total,
      totalCount,
      // remaining,
      remainingCount,
      remainingPercent,
      // finished,
      finishedCount,
      finishedPercent,
      // failed,
      failedCount,
      failedPercent,
    };
  });

  const isReady = ref(false);
  watchEffect(async () => {
    if (loading.value.remainingCount == 0) {
      await wait(300);
      isReady.value = true;
    }
  });

  return {
    isReady,
    reactivityLazyListOfLoading,
    loading,
  };
};

export const appLoading = {
  loadingMount,
  loadingEnvs,
  loadingPinia,
  loadingRouter,
  loadingtailwind,
  loadingVuetify,
  loadingmotion,
  loadingIcon,
};
