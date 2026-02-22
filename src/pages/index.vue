<template>
  <VContainer>
    <VRow>
      <VCol cols="12">
        <Toast :max-show="10"></Toast>
      </VCol>
      <div>
        {{
          appJwt.payload
        }}
      </div>
    </VRow>
    <VRow align="center" justify="center">
      <VCol cols="6">
        <div class="rounded-full p-12! text-center text-6xl border-4 border-tw-primary text-tw-primary">
          <span>Dexterous</span>
          <i class="fa-solid fa-medal"></i>
        </div>
      </VCol>
      <VCol cols="12">
        <VSelect label="font" :items="setting.statics.fontList" v-model="setting.defaults.font" item-value="key"
          item-title="name">
        </VSelect>
        <VSelect label="language" :items="setting.statics.languageList" v-model="setting.defaults.language"
          item-value="key" item-title="name"></VSelect>
        <VSelect label="theme" :items="setting.statics.themeModeList" v-model="setting.defaults.themeMode"
          item-value="key" item-title="name"></VSelect>
        <VSelect label="theme" :items="setting.statics.paletteList" v-model="setting.defaults.palette" item-value="key"
          item-title="name"></VSelect>
      </VCol>
      <VCol cols="12">
        <div size="40" :class="{
          'bg-red-500': display.name.value == 'xs',
          'bg-orange-500': display.name.value == 'sm',
          'bg-yellow-500': display.name.value == 'md',
          'bg-green-500': display.name.value == 'lg',
          'bg-blue-500': display.name.value == 'xl',
          'bg-pink-500': display.name.value == 'xxl',
        }">{{ display.name }}</div>
      </VCol>
      <VCol cols="12">
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
          <VBtn @click="
            appToast.service?.show({
              title: 'Authentcation Error',
              type: 'error',
              closable: false,
              canSave: false,
              canPause: true,
              location: { y: 'bottom', x: 'right' },
              messages: [
                'salam aleykom',
                'hale shoma chetore ?',
                '[vite] hot updated: /src/components/base/ToastItem.vue',
                `observer called please_add_to_list
  index.ts:264 observer called please_show
  index.ts:264 observer called please_retry_show
  index.ts:264 observer called please_add_to_list`,
              ],
              showMessageDelay: 500,
              showTime: 8000,
              actions: {
                save: {
                  label: 'Save',
                  variant: 'tonal',
                  entryTask: async ({ setLoadingValue, pause, resume }) => {
                    setLoadingValue(true);
                    pause();
                    await tools.time.wait(1000);
                    console.log('Go function clicked');
                    setLoadingValue(false);
                    resume();
                  },
                },
                send: {
                  label: 'Send',
                  variant: 'tonal',
                  entryTask: async ({ setLoadingValue, stop, pause, resume }) => {
                    setLoadingValue(true);
                    await tools.time.wait(1000);
                    console.log('Go function clicked');
                    setLoadingValue(false);
                    stop();
                  },
                },
                feedback: {
                  label: 'Feedback',
                  variant: 'tonal',
                  entryTask: async ({ setLoadingValue }) => {
                    setLoadingValue(true);
                    await tools.time.wait(1000);
                    console.log('Go function clicked');
                    setLoadingValue(false);
                  },
                },
              },
            })
            ">error bottom left</VBtn>
          <VBtn @click="
            appToast.service?.show({
              title: 'salam',
              type: 'info',
              location: { y: 'bottom', x: 'right' },
              messages: ['salam aleykom', 'hale shoma chetore ?'],
              showMessageDelay: 0,
              showTime: 2000,
            })
            ">error bottom right</VBtn>
          <VBtn @click="
            appToast.service?.show({
              title: 'salam',
              type: 'warning',
              location: { y: 'top', x: 'left' },
            })
            ">error top left</VBtn>
          <VBtn @click="
            appToast.service?.show({
              title: 'salam',
              type: 'success',
              location: { y: 'top', x: 'right' },
            })
            ">error top right</VBtn>
        </VCard>
      </VCol>

    </VRow>
  </VContainer>
</template>

<script lang="ts" setup>
import { useApiSchemas } from "@/apis";
import { useApi } from "@/composables/api";
import { useAppSetting } from "@/stores/application/setting";
import _ from "lodash";
import { onMounted, ref } from "vue";
import {
  VBtn,
  VCard,
  VCardActions,
  VCardText,
  VCardTitle,
  VCol,
  VContainer,
  VDivider,
  VRow,
  VSelect,
} from "vuetify/components";
import tools from "@/tools";
import { useAppToast } from "@/stores/application/toast";
import Toast from "@/components/base/Toast.vue";
import { useDisplay } from "@/composables/display";
import { useAppJwt } from "@/stores/application/jwt";

definePage({
  meta: {
    whoCanAccessThisRoute: ["public"],
  },
});

const appToast = useAppToast();

const setting = useAppSetting();

const apiSchema = useApiSchemas();
const api = useApi(apiSchema.getOrigin.config, (v) => {
  return {
    cacheTime: 0,
  };
});

const display = useDisplay()
const appJwt = useAppJwt()
onMounted(() => {
  setTimeout(() => {
    appJwt.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImF1ZCI6Imx5bngtZmFjZS1hdXRoIiwiaXNzIjoibHlueC1mYWNlLWF1dGgiLCJleHAiOjE3NzE3NzU3Nzd9.qKsUeB93nyiQ-eC_-7jvJ6d9o25uC7DmPbnB4AhvaiY')
  }, 3000);
});

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
