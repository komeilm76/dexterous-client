<template>
  <div class="toast-component">
    <!-- <div>activeList:{{ appToast.service.activeList }}</div> -->
    <!-- <div>finishedList:{{ appToast.service.finishedList }}</div> -->
    <!-- <div>notStartedList:{{ appToast.service.notStartedList }}</div> -->
    <div class="fixed top-0 right-0 p-1! z-[100]">
      <ToastItem :list="activeInTopRight"></ToastItem>
    </div>
    <div class="fixed top-0 left-0 p-1! z-[100]">
      <ToastItem :list="activeInTopLeft"></ToastItem>
    </div>
    <div class="fixed bottom-0 right-0 p-1! z-[100]">
      <ToastItem :list="activeInBottomRight"></ToastItem>
    </div>
    <div class="fixed bottom-0 left-0 p-1! z-[100]">
      <ToastItem :list="activeInBottomLeft"></ToastItem>
    </div>
    <!-- <VExpandTransition group>
      <VCard
        v-for="item in toastService.activeList.value"
        :key="item.id"
        density="compact"
        :color="item.type"
        variant="elevated"
        width="300"
        class="mb-2"
      >
        <VCardTitle class="px-2 py-2 w-full">
          <div class="flex w-full items-center justify-start">
            <VBtn class="me-2" size="x-small" icon flat variant="tonal">
              <VIcon>
                <i class="fa fa-light fa-check"></i>
              </VIcon>
            </VBtn>
            <span
              class="font-normal me-2 text-ellipsis shrink overflow-hidden"
              >{{ item.title }}</span
            >
            <VSpacer></VSpacer>
            <div>
              <VBtn
                class="me-2"
                size="x-small"
                icon
                flat
                variant="tonal"
                @click="
                  item.isSaved
                    ? item.deleteToastFromHistory()
                    : item.saveToastInHistory()
                "
              >
                <VIcon>
                  <i v-if="!item.isSaved" class="fa fa-light fa-bookmark"></i>
                  <i v-if="item.isSaved" class="fa fa-solid fa-bookmark"></i>
                </VIcon>
              </VBtn>
              <VBtn
                class="me-2"
                size="x-small"
                icon
                flat
                variant="tonal"
                @click="item.isActive ? item.pause() : item.resume()"
              >
                <VIcon>
                  <i v-if="item.isActive" class="fa fa-light fa-pause"></i>
                  <i v-if="!item.isActive" class="fa fa-light fa-play"></i>
                </VIcon>
              </VBtn>
              <VBtn
                size="x-small"
                icon
                flat
                variant="tonal"
                @click="item.stop()"
              >
                <VIcon>
                  <i class="fa fa-light fa-close"></i>
                </VIcon>
              </VBtn>
            </div>
          </div>
        </VCardTitle>
        <VProgressLinear
          class="mb-[1px]!"
          :buffer-value="100"
          :model-value="item.remainingPercent"
          chunk-count="100"
          chunk-gap="0"
          height="2"
        ></VProgressLinear>
        <template v-if="item.messages.length > 0">
          <VCardText>
            <div class="mb-1" v-for="message in item.messages" :key="message">
              {{ message }}
            </div>
          </VCardText>
        </template>
<VDivider></VDivider>
<VCardActions>
  <VBtn v-for="(action, index) in item.actions" @click="() => action.task()" :loading="action.loading">
    {{ action.label }}
  </VBtn>
</VCardActions>
<VCardText>{{ item.actions }}</VCardText>
</VCard>
</VExpandTransition> -->
  </div>
</template>

<script setup lang="ts">
import {
  makeToastService,
  type IToastServiceOptions,
} from "@/composables/toast";
import { useAppToast } from "@/stores/application/toast";
import { computed, onMounted } from "vue";
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VDivider,
  VExpandTransition,
  VIcon,
  VProgressLinear,
  VSpacer,
} from "vuetify/components";

type IMacros = {
  props: {} & Partial<Omit<IToastServiceOptions, "checker">>;
  emits: {
    close: [data: string];
  };
  slots: {
    header(props: { data: string }): any;
  };
  exposes: {};
};

const props = withDefaults(defineProps<IMacros["props"]>(), {});
const emits = defineEmits<IMacros["emits"]>();
const slots = defineSlots<IMacros["slots"]>();
defineExpose<IMacros["exposes"]>({});
defineOptions({
  name: "Toast",
});

const toastService = makeToastService({
  defaultInterval: props.defaultInterval,
  defaultShowTime: props.defaultShowTime,
  defaultType: props.defaultType,
  maxShow: props.maxShow,
});

const activeInTopRight = computed(() => {
  return toastService.activeList.value.filter((item) => {
    return item.location.y == "top" && item.location.x == "right";
  }) as ReturnType<typeof makeToastService>["activeList"]["value"];
});

const activeInTopLeft = computed(() => {
  return toastService.activeList.value.filter((item) => {
    return item.location.y == "top" && item.location.x == "left";
  });
});
const activeInBottomRight = computed(() => {
  return toastService.activeList.value.filter((item) => {
    return item.location.y == "bottom" && item.location.x == "right";
  });
});
const activeInBottomLeft = computed(() => {
  return toastService.activeList.value.filter((item) => {
    return item.location.y == "bottom" && item.location.x == "left";
  });
});



const appToast = useAppToast();
onMounted(() => {
  appToast.registerService(toastService);
});
</script>

<style scoped lang="scss">
.toast-component {}
</style>
