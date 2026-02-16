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
  const loading = computed(() => {
    const list = Object.values(loadings);
    const errorCounts = list.filter((item) => {
      return item.value == "failed";
    }).length;

    const statusList = list.map((item, index) => {
      if (item.value == "not-started") {
        return true;
      } else if (item.value == "in-progress") {
        return true;
      } else {
        return false;
      }
    });

    const total = statusList.length;
    const remaining = statusList.filter((item) => {
      return item == true;
    }).length;
    const finished = statusList.filter((item) => {
      return item == false;
    }).length;
    const remainingPercent = (remaining * 100) / total;
    const finishedPercent = (finished * 100) / total;
    return {
      total,
      remaining,
      finished,
      remainingPercent,
      finishedPercent,
      errorCounts,
    };
  });
  const reactivityLazyListOfLoading = ref();
  const listOfLoadings = Object.values(loadings);
  watch(listOfLoadings, async (nll, oll) => {
    let index = 0;
    for await (const n of nll) {
      if (n === oll[index]) {
        await wait(1000);
        reactivityLazyListOfLoading.value[index] = n;
      }
    }
  });

  watchEffect(()=>{
    if (reactivityLazyListOfLoading.value) {
      
    }
  })

  const finishedLazy = ref(0);
  const isReady = ref(false);
  // watchEffect(async () => {
  //   if (loading.value.remaining == 0) {
  //     await wait(1000);
  //     isReady.value = true;
  //   }
  // });
  watch(loading, async (n, o) => {
    if (n.remaining < o.remaining) {
      await wait(300);
    }
    finishedLazy.value = n.finishedPercent;
  });
  watchEffect(async () => {
    if (finishedLazy.value == 100) {
      await wait(1000);
      isReady.value = true;
    }
  });
  return {
    loading,
    isReady,
    finishedLazy,
    // ...loadings,
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
