<template>
  <div class="toast-component">
    <VExpandTransition group>
      <VCard v-for="item in props.list" :key="item.id" density="compact" variant="elevated" max-width="320"
        min-width="280" class="mt-1" :color="item.type">
        <VCardTitle class="px-1 py-1 w-full">
          <div class="flex w-full items-center justify-start">
            <VAvatar class="me-1 p-2!" flat variant="text" :size="'small'">
              <VIcon size="small">
                <i v-if="item.type == 'success'" class="fa fa-sharp-duotone fa-thin fa-circle-check"></i>
                <i v-else-if="item.type == 'error'" class="fa fa-sharp-duotone fa-thin fa-circle-xmark"></i>
                <i v-else-if="item.type == 'info'" class="fa fa-sharp-duotone fa-thin fa-circle-info"></i>
                <i v-else-if="item.type == 'warning'" class="fa fa-sharp-duotone fa-thin fa-triangle-exclamation"></i>
              </VIcon>
            </VAvatar>
            <span class="font-bold me-1 text-ellipsis shrink overflow-hidden text-sm">{{ item.title }}</span>
            <VSpacer></VSpacer>
            <div>
              <VBtn v-if="item.canSave" class="me-1" size="x-small" icon flat variant="tonal" @click="
                item.isSaved
                  ? item.deleteToastFromHistory()
                  : item.saveToastInHistory()
                ">
                <VIcon>
                  <i v-if="!item.isSaved" class="fa fa-light fa-bookmark"></i>
                  <i v-if="item.isSaved" class="fa fa-solid fa-bookmark"></i>
                </VIcon>
              </VBtn>
              <VBtn v-if="item.canPause" class="me-1" size="x-small" icon flat variant="tonal"
                @click="item.isActive ? item.pause() : item.resume()">
                <VIcon>
                  <i v-if="item.isActive" class="fa fa-light fa-pause"></i>
                  <i v-if="!item.isActive" class="fa fa-light fa-play"></i>
                </VIcon>
              </VBtn>
              <VBtn v-if="item.closable" size="x-small" icon flat variant="tonal" @click="item.stop()">
                <VIcon>
                  <i class="fa fa-light fa-close"></i>
                </VIcon>
              </VBtn>
            </div>
          </div>
        </VCardTitle>
        <VProgressLinear class="mb-[1px]!" :buffer-value="100" :model-value="item.remainingPercent" chunk-count="100"
          chunk-gap="2" height="2"></VProgressLinear>
        <!-- <VDivider></VDivider> -->
        <template v-if="item.showMessageDelay > 0">
          <VExpandTransition :key="item.id">
            <VCardText class="m-0! p-0!" v-if="item.messages.length > 0 && item.canShowMessageList">
              <div class="mx-2! my-1 max-h-[120px]! overflow-y-auto overscroll-none">
                <div class="whitespace-normal flex items-start justify-center [&>*]:leading-4! mb-1"
                  v-for="message in item.messages" :key="message">
                  <i class="fa fa-solid fa-dot fa-fw"></i>
                  <span class="w-full font-mono! text-[10px]! font-light">
                    {{ message }}
                  </span>
                </div>
              </div>
            </VCardText>
          </VExpandTransition>
        </template>
        <template v-else>
          <VCardText class="m-0! p-0!" v-if="item.messages.length > 0">
            <div class="mx-2! my-1 max-h-[120px]! overflow-y-auto overscroll-none">
              <div class="whitespace-normal flex items-start justify-center [&>*]:leading-4! mb-1"
                v-for="message in item.messages" :key="message">
                <i class="fa fa-solid fa-dot fa-fw"></i>
                <span class="w-full font-mono! text-[10px]! font-light">
                  {{ message }}
                </span>
              </div>
            </div>
          </VCardText>
        </template>

        <template v-if="Object.keys(item.actions).length > 0">
          <VDivider></VDivider>
          <VCardActions class="px-2! py-1! min-h-auto!">
            <VBtn size="small" v-for="(action, index) in item.actions" @click="() => action.task()"
              :loading="action.loading">
              {{ action.label }}
            </VBtn>
          </VCardActions>
        </template>
      </VCard>
    </VExpandTransition>
  </div>
</template>

<script setup lang="ts">
import {
  makeToastService,
  type IToast,
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
  VSlideYTransition,
  VSpacer,
} from "vuetify/components";

type IMacros = {
  props: {
    list: ReturnType<typeof makeToastService>["activeList"]["value"];
  };
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

onMounted(() => { });
</script>

<style scoped lang="scss">
.toast-component {}
</style>
