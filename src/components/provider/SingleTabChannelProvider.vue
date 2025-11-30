<template>
  <slot v-if="show" name="default">
  </slot>
  <slot v-else name="error">
    <VContainer>
      <VRow justify="center" align="center" class="h-[calc(100svh)]">
        <VCol cols="12">
          <VAlert variant="tonal" type="error">
            <VAlertTitle class="!font-black !text-2xl">
              Tab Restriction
            </VAlertTitle>
            <div class="font-bold">This Application Limited To Single Tab.</div>
            <div class="font-medium">Two Solution Exist:</div>
            <div>1.Please find and close other tabs so you can use this tab</div>
            <div class="flex items-center justify-between">
              <div>2.Reload This Tab (This Action Limit Other Tabs)</div>
              <div>
                <VBtn @click="reload" variant="tonal" size="x-small">Reload</VBtn>
              </div>
            </div>
          </VAlert>
        </VCol>
      </VRow>

    </VContainer>
  </slot>

</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import { useBroadcastChannel, useWindowFocus } from '@vueuse/core'

type IMacros = {
  props: {
  };
  emits: {
  };
  slots: {
    default(): any;
    error(): any;
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

const {
  post,
  data,
} = useBroadcastChannel<'TAB:OPEN' | 'TAB:CLOSE', 'TAB:OPEN' | 'TAB:CLOSE'>({ name: 'single_tab' })

const isFocused = useWindowFocus()

const show = ref(true)
watch(data, () => {
  console.log('data', data);
  if (data.value == 'TAB:OPEN') {
    show.value = false
  } else {
    show.value = true
  }
})

watch(isFocused, (n, o) => {
  if (isFocused.value) {
    post('TAB:OPEN')
  } else {
    post('TAB:CLOSE')
  }
})

const reload = () => {
  window.location.reload()
}
window.addEventListener('load', () => {
  show.value = true
  post('TAB:OPEN')
})
window.addEventListener('unload', () => {
  post('TAB:CLOSE')
})



</script>

<style scoped lang="scss"></style>
