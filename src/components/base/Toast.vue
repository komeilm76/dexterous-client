<template>
  <div class="toast-component">
    <div class="fixed top-0 right-0 p-1! z-[10000]">
      <ToastItem :list="activeInTopRight"></ToastItem>
    </div>
    <div class="fixed top-0 left-0 p-1! z-[10000]">
      <ToastItem :list="activeInTopLeft"></ToastItem>
    </div>
    <div class="fixed bottom-0 right-0 p-1! z-[10000]">
      <ToastItem :list="activeInBottomRight"></ToastItem>
    </div>
    <div class="fixed bottom-0 left-0 p-1! z-[10000]">
      <ToastItem :list="activeInBottomLeft"></ToastItem>
    </div>
    <slot name="default" data=""></slot>
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
    default(props: { data: string }): any;
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
