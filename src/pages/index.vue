<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <Toast></Toast>
      </VCol>
    </VRow>
    <VRow align="center" justify="center">
      <VCol cols="6">
        <div
          class="rounded-full p-12! text-center text-6xl border-4 border-tw-primary text-tw-primary"
        >
          <span>Dexterous</span>
          <i class="fa-solid fa-medal"></i>
        </div>
      </VCol>
      <VCol cols="12">
        <VSelect
          label="font"
          :items="setting.statics.fontList"
          v-model="setting.defaults.font"
          item-value="key"
          item-title="name"
        >
        </VSelect>
        <VSelect
          label="language"
          :items="setting.statics.languageList"
          v-model="setting.defaults.language"
          item-value="key"
          item-title="name"
        ></VSelect>
        <VSelect
          label="theme"
          :items="setting.statics.themeModeList"
          v-model="setting.defaults.themeMode"
          item-value="key"
          item-title="name"
        ></VSelect>
        <VSelect
          label="theme"
          :items="setting.statics.paletteList"
          v-model="setting.defaults.palette"
          item-value="key"
          item-title="name"
        ></VSelect>
      </VCol>
      <VCard class="w-full">
        <VCardTitle>Card</VCardTitle>
        <VDivider></VDivider>
        <VCardText>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum
          placeat tempora at quia molestiae aspernatur distinctio!
        </VCardText>
        <VDivider></VDivider>
        <VCardActions>
          <VBtn color="primary">YES</VBtn>
          <VBtn color="secondary">NO</VBtn>
          <VBtn color="error">NO</VBtn>
          <VBtn color="info">NO</VBtn>
          <VBtn color="success">NO</VBtn>
          <VBtn color="warning">NO</VBtn>
        </VCardActions>
        <VBtn
          @click="
            appToast.service?.show({
              title: 'salam',
              type: 'success',
              location: { y: 'bottom', x: 'left' },
              messages: ['salam aleykom', 'hale shoma chetore ?'],
              showMessageDelay: 300,
            })
          "
          >error bottom left</VBtn
        >
        <VBtn
          @click="
            appToast.service?.show({
              title: 'salam',
              type: 'info',
              location: { y: 'bottom', x: 'right' },
              messages: ['salam aleykom', 'hale shoma chetore ?'],
              showMessageDelay: 0,
            })
          "
          >error bottom right</VBtn
        >
        <VBtn
          @click="
            appToast.service?.show({
              title: 'salam',
              type: 'warning',
              location: { y: 'top', x: 'left' },
            })
          "
          >error top left</VBtn
        >
        <VBtn
          @click="
            appToast.service?.show({
              title: 'salam',
              type: 'error',
              location: { y: 'top', x: 'right' },
            })
          "
          >error top right</VBtn
        >

        <div>
          {{ useAppToast().getSavedToast() }}
        </div>

        <!-- <div>
          <div> finished: {{ toast.finishedList.value.length }}</div>
          <div v-for="item in toast.finishedList.value">{{ item }}</div>
        </div> -->
      </VCard>
    </VRow>
  </VContainer>
</template>

<script lang="ts" setup>
import { useApiSchemas } from "@/apis";
import { useApi } from "@/composables/api";
// import { useToast } from '@/composables/toast-new';
import { useAppSetting } from "@/stores/application/setting";
import kmIcon from "km-icon";
import _ from "lodash";
import { onMounted, ref, type Ref } from "vue";
import { VProgressLinear } from "vuetify/components";
import tools from "@/tools";
import { useAppToast } from "@/stores/application/toast";
import Toast from "@/components/base/Toast.vue";

const appToast = useAppToast();

const setting = useAppSetting();

const apiSchema = useApiSchemas();
const api = useApi(apiSchema.getOrigin.config, (v) => {
  return {
    cacheTime: 0,
  };
});

onMounted(() => {});

const loadingFeedback = ref<boolean>(false);

const feedbackTask = async () => {
  await tools.time.wait(2000);
};
</script>

<style lang="scss">
.box {
  width: 300px;
  height: 300px;
  background-color: white;
  overflow-y: auto;
  direction: ltr;

  .item {
    color: black;
  }
}

body[dir="rtl"] .box .item {
  direction: rtl;
}

body[dir="ltr"] .box .item {
  direction: ltr;
}
</style>
