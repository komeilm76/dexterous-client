<template>
  <div class="font-provider">
    <slot name="default"></slot>
  </div>
</template>

<script setup lang="ts">
import type { IFontType } from "@/stores/application/setting/font/types";
import { computed, watch } from "vue";

type IMacros = {
  props: {
    fontFamily: IFontType;
    writeOnOutsideOfApp: boolean
  };
  emits: {
  };
  slots: {
    default(): any;
  };
  exposes: {};
};

const props = defineProps<IMacros["props"]>();
const emits = defineEmits<IMacros["emits"]>();
const slots = defineSlots<IMacros["slots"]>();
defineExpose<IMacros["exposes"]>({});
defineOptions({
  name: "FontProvider",
});
const fontFamily = computed(() => {
  return props.fontFamily;
});
const writeOnOutsideOfApp = computed(() => {
  return props.writeOnOutsideOfApp;
});
watch(
  [fontFamily, writeOnOutsideOfApp],
  ([newValueOfFontFamily, newValueOfWriteOnOutsideOfApp]) => {
    let root = document.body;
    if (newValueOfWriteOnOutsideOfApp == true) {
      root.style.setProperty("--root-font-family", newValueOfFontFamily, "important");
    } else {
      root.style.removeProperty("--root-font-family");
    }
  },
  { immediate: true }
);
</script>

<style scoped lang="scss">
.font-provider {
  --provider-font-family: v-bind('$props.fontFamily');
  font-family: var(--provider-font-family);

  *:not([class*='fa-']) {
    font-family: var(--provider-font-family);
  }
}
</style>

<style lang="scss">
body *:not(#app):not(#app *) {
  font-family: var(--root-font-family);
}
</style>
