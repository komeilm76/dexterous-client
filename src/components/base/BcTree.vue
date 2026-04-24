<template>
  <div class="overflow-y-clip!" :class="[{ 'text-disabled': props.readonly }]">
    <template v-for="item in computedItems" :key="item.title">
      <!-- <VExpandTransition> -->
      <div class="flex pt-2">
        <div
          class="flex items-start shrink! flex-col"
          :class="[{ 'border-b! border-l! border-t!': item.children }]"
        >
          <div class="flex flex-row-reverse my-0">
            <BcIcon
              name="dot"
              size="xs"
              weight="light"
              class="mx-1 pt-2"
            ></BcIcon>
          </div>
        </div>
        <div
          class="flex flex-col node grow!"
          :class="[{ 'mb-0!': item.children == undefined }]"
        >
          <div
            class="flex items-start node-item pt-0 p-1! pb-0 transition-colors cursor-pointer"
            :class="[props.activeClass]"
            @click="
              props.readonly == false &&
              (item.activated.value = !item.activated.value)
            "
          >
            <BcIcon
              :name="
                item.icon
                  ? item.icon
                  : item.children
                    ? item.activated.value
                      ? 'folder-open'
                      : 'folder'
                    : typeof item.title == 'string'
                      ? getIconByName(item.title)
                      : getIconByName(item.title[0])
              "
              class="me-1 my-2"
              size="sm"
            ></BcIcon>
            <span class="leading-0 my-2 select-none text-sm">
              <template v-if="typeof item.title == 'string'">
                <span class="font-medium">{{ item.title }}</span>
              </template>
              <template v-else>
                <span v-if="item.title[0]" class="font-medium me-1">{{
                  item.title[0]
                }}</span>
                <span class="opacity-50" v-if="item.title[1]">{{
                  item.title[1]
                }}</span>
              </template>
            </span>
          </div>
          <VFadeTransition>
            <div
              class="node-children"
              v-if="item.children && item.activated.value"
            >
              <BcTree
                :items="item.children"
                :force-expand="props.forceExpand"
                :force-expand-effect-delay="0"
                :readonly="props.readonly"
              ></BcTree>
            </div>
          </VFadeTransition>
        </div>
      </div>
      <!-- </VExpandTransition> -->

      <!-- <div>
        {{ item.title }}
      </div> -->
    </template>
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import BcIcon from "./BcIcon.vue";

type ITree = {
  title: string | [string] | [string, string];
  icon?: string;
  children?: ITree[];
  opend?: boolean;
  activated?: boolean;
};

type IMacros = {
  props: {
    items: ITree[];
    forceExpand?: boolean;
    forceExpandEffectDelay?: number;
    activeClass?: string | Record<string, boolean> | Record<string, boolean>[];
    readonly?: boolean;
  };
  emits: {
    close: [data: string];
  };
  slots: {
    children(props: { items: ITree[] }): any;
    prepend(props: { data: string }): any;
  };
  exposes: {};
};

const props = withDefaults(defineProps<IMacros["props"]>(), {
  items: () => [],
  forceExpand: false,
  forceExpandEffectDelay: 0,
  readonly: false,
});
const emits = defineEmits<IMacros["emits"]>();
const slots = defineSlots<IMacros["slots"]>();
defineExpose<IMacros["exposes"]>({});
defineOptions({
  name: "BcCopyText",
});

import { useClipboard } from "@vueuse/core";
import { VBtn, VTooltip } from "vuetify/components";
import { computed, onBeforeMount, onBeforeUnmount, onMounted, ref } from "vue";
import { useAppSetting } from "@/stores/application/setting";
const { copied, copy, isSupported } = useClipboard();
const setting = useAppSetting();

const forceEffect = ref();

const crawl = (items: ITree[]) => {
  return items.map((item) => {
    return {
      ...item,
      activated: ref(
        forceEffect.value == true ? true : item.activated || false,
      ),
    };
  });
};

onBeforeMount(() => {
  if (props.forceExpandEffectDelay == 0) {
    forceEffect.value = true;
  }
});
onMounted(() => {
  if (props.forceExpand == true) {
    if (props.forceExpandEffectDelay && props.forceExpandEffectDelay > 0) {
      setTimeout(() => {
        forceEffect.value = true;
      }, props.forceExpandEffectDelay);
    } else {
      forceEffect.value = true;
    }
  }
});

onBeforeUnmount(() => {});

const getIconByName = (name: string) => {
  const lastPart = _.takeRight(name.split("."), 1)[0] || "";
  console.log("lastPart", lastPart);
  if (["jpeg", "png", "jpg"].includes(lastPart)) {
    return "file-image";
  } else if (["zip", "rar"].includes(lastPart)) {
    return "file-zip";
  } else {
    return "file";
  }
};

const computedItems = computed(() => {
  return crawl(props.items);
});
</script>

<style scoped lang="scss">
.bc-copy-text {
}
</style>
