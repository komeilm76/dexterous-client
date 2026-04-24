<template>
  <div class="inline-flex!">
    <i
      class="bc-icon fa-fw"
      @click="() => {}"
      :class="[
        kmIcon.fontawesome.makeClassNameList({
          name: props.name,
          family: props.family,
          weight: props.weight,
          size: props.size,
          animation: props.animation,
        }),
        { 'contents!': props.animation == 'default' },
      ]"
    >
    </i>
  </div>
</template>

<script setup lang="ts">
import kmIcon from "km-icon";
type IMacros = {
  props: {
    name: string;
    size?: "default" | "sm" | "xs" | "lg" | "xl" | "2xl" | "2xs";
    animation?:
      | "default"
      | "beat"
      | "beat-fade"
      | "fa-bounce"
      | "fa-fade"
      | "fa-flip"
      | "shake"
      | "spin"
      | "spin-reverse"
      | "spin-pulse";
    weight?: "light" | "default" | "regular" | "solid" | "thin" | "semibold";
    family?:
      | "default"
      | "classic"
      | "sharp-duotone"
      | "duotone"
      | "sharp"
      | "chisel"
      | "etch"
      | "jelly"
      | "jelly-duo"
      | "jelly-fill"
      | "notdog"
      | "notdog-duo"
      | "slab"
      | "slab-press"
      | "thumbprint"
      | "utility"
      | "utility-duo"
      | "utility-fill"
      | "whiteboard";
  };
  emits: {
    close: [data: string];
  };
  slots: {};
  exposes: {};
};
const props = withDefaults(defineProps<IMacros["props"]>(), {
  size: "lg",
  animation: "default",
  weight: "light",
  family: "sharp-duotone",
});
const emits = defineEmits<IMacros["emits"]>();
const slots = defineSlots<IMacros["slots"]>();
defineExpose<IMacros["exposes"]>({});
defineOptions({
  name: "BcIcon",
});
</script>
<style scoped lang="scss">
.bc-icon {
  font-family: var(--fa-family) !important;
}
</style>
<style lang="scss">
.v-btn:has(.bc-icon) {
  text-indent: 0 !important;
}
</style>
