<template>
  <div
    class="bc-app-disable transition-opacity! duration-500"
    :class="{ 'opacity-25! pointer-events-none! select-none!': isDisabled }"
  >
    <slot name="default" data=""></slot>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";

type IMacros = {
  props: {};
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
  name: "BcCopyText",
});

import { useClipboard } from "@vueuse/core";
import { VBtn, VTooltip } from "vuetify/components";
import { onMounted, ref } from "vue";
import { appStatus } from "@/stores/subjects";
import { useAppToast } from "@/stores/application/toast";
const { copied, copy, isSupported } = useClipboard();

const toast = useAppToast();

const isDisabled = ref(false);

appStatus.subscribe((o) => {
  isDisabled.value = o.disabled;
});

onMounted(() => {});
</script>

<style scoped lang="scss">
.bc-app-disable {
}
</style>
