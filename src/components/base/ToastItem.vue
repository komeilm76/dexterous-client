<template>
  <div class="toast-component">
    <VExpandTransition group>
      <VCard
        v-for="item in props.list"
        :key="item.id"
        density="compact"
        :color="item.type"
        variant="elevated"
        width="270"
        class="mt-1"
      >
        <VCardTitle class="px-1 py-1 w-full">
          <div class="flex w-full items-center justify-start">
            <VBtn class="me-1" size="x-small" icon flat variant="tonal">
              <VIcon>
                <i class="fa fa-light fa-check"></i>
              </VIcon>
            </VBtn>
            <span
              class="font-normal me-1 text-ellipsis shrink overflow-hidden"
              >{{ item.title }}</span
            >
            <VSpacer></VSpacer>
            <div>
              <VBtn
                class="me-1"
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
                class="me-1"
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
          chunk-gap="2"
          height="2"
        ></VProgressLinear>
        <VDivider></VDivider>
        <template v-if="item.showMessageDelay > 0">
          <VExpandTransition :key="item.id">
            <VCardText
              class="m-0! p-0!"
              v-if="item.messages.length > 0 && item.canShowMessageList"
            >
              <div class="mx-2! my-1">
                <div
                  class="mb-2 whitespace-nowrap"
                  v-for="message in item.messages"
                  :key="message"
                >
                  {{ message }}
                </div>
              </div>
            </VCardText>
          </VExpandTransition>
        </template>
        <template v-else>
          <VCardText class="m-0! p-0!" v-if="item.messages.length > 0">
            <div class="mx-2! my-1">
              <div
                class="mb-2 whitespace-nowrap"
                v-for="message in item.messages"
                :key="message"
              >
                {{ message }}
              </div>
            </div>
          </VCardText>
        </template>

        <template v-if="Object.keys(item.actions).length > 0">
          <VDivider></VDivider>
          <VCardActions>
            <VBtn
              v-for="(action, index) in item.actions"
              @click="() => action.task()"
              :loading="action.loading"
            >
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
} from "@/composables/toast-new";
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

onMounted(() => {});
</script>

<style scoped lang="scss">
.toast-component {
}
</style>
