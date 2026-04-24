<template>
  <VContainer>
    <VRow align="center" justify="center">
      <VCol cols="12">
        <VCard>
          <VCardTitle class="text-6xl! border-t-8 text-tw-primary!">
            Dexterous
          </VCardTitle>
          <VDivider></VDivider>
          <VCardText>
            <VRow>
              <VCol cols="12">
                <VCard variant="outlined" color="primary">
                  <VCardTitle>Icons</VCardTitle>
                  <VDivider></VDivider>
                  <VCardText>
                    <div class="flex items-center">
                      <div class="text-xl font-bold me-1">solid:</div>
                      <div>
                        <i class="fa-solid fa-home"></i>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="text-xl font-bold me-1">regular:</div>
                      <div>
                        <i class="fa-regular fa-home"></i>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="text-xl font-bold me-1">duotone:</div>
                      <div>
                        <i class="fa-duotone fa-home"></i>
                      </div>
                    </div>
                    <div class="flex items-center">
                      <div class="text-xl font-bold me-1">sharp-duotone:</div>
                      <div>
                        <i class="fa-sharp-duotone fa-home"></i>
                      </div>
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol cols="12">
                <VCard variant="outlined">
                  <VCardTitle>useAppSetting</VCardTitle>
                  <VDivider></VDivider>
                  <VCardText>
                    <VSelect
                      variant="outlined"
                      density="compact"
                      class="text-tw-primary!"
                      color="primary"
                      base-color="primary"
                      label="font"
                      :items="setting.statics.fontList"
                      v-model="setting.defaults.font"
                      item-value="key"
                      item-title="name"
                    >
                    </VSelect>
                    <VSelect
                      variant="outlined"
                      density="compact"
                      class="text-tw-secondary!"
                      color="secondary"
                      base-color="secondary"
                      label="language"
                      :items="setting.statics.languageList"
                      v-model="setting.defaults.language"
                      item-value="key"
                      item-title="name"
                    ></VSelect>
                    <VSelect
                      variant="outlined"
                      density="compact"
                      class="text-tw-warning!"
                      color="warning"
                      base-color="warning"
                      label="theme mode"
                      :items="setting.statics.themeModeList"
                      v-model="setting.defaults.themeMode"
                      item-value="key"
                      item-title="name"
                    ></VSelect>
                    <VSelect
                      variant="outlined"
                      density="compact"
                      class="text-tw-error!"
                      color="error"
                      base-color="error"
                      label="theme palette"
                      :items="setting.statics.paletteList"
                      v-model="setting.defaults.palette"
                      item-value="key"
                      item-title="name"
                    ></VSelect>
                  </VCardText>
                </VCard>
              </VCol>
              <VCol cols="12">
                <VCard class="w-full" variant="outlined">
                  <VCardTitle>useAppToast</VCardTitle>
                  <VDivider></VDivider>
                  <VCardActions>
                    <VBtn
                      color="error"
                      @click="
                        appToast.service?.show({
                          title: 'Authentcation Error',
                          type: 'error',
                          closable: false,
                          canSave: false,
                          canPause: true,
                          location: { y: 'bottom', x: 'left' },
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
                              entryTask: async ({
                                setLoadingValue,
                                pause,
                                resume,
                              }) => {
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
                              entryTask: async ({
                                setLoadingValue,
                                stop,
                                pause,
                                resume,
                              }) => {
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
                      "
                      >bottom left</VBtn
                    >
                    <VBtn
                      color="info"
                      @click="
                        appToast.service?.show({
                          title: 'salam',
                          type: 'info',
                          location: { y: 'bottom', x: 'right' },
                          messages: ['salam aleykom', 'hale shoma chetore ?'],
                          showMessageDelay: 0,
                          showTime: 2000,
                        })
                      "
                      >bottom right</VBtn
                    >
                    <VBtn
                      color="warning"
                      @click="
                        appToast.service?.show({
                          title: 'salam',
                          type: 'warning',
                          location: { y: 'top', x: 'left' },
                        })
                      "
                      >top left</VBtn
                    >
                    <VBtn
                      color="success"
                      @click="
                        appToast.service?.show({
                          title: 'salam',
                          type: 'success',
                          location: { y: 'top', x: 'right' },
                        })
                      "
                      >top right</VBtn
                    >
                  </VCardActions>
                </VCard>
              </VCol>
              <VCol cols="12">
                <VCard
                  class="rounded-md!"
                  variant="outlined"
                  size="40"
                  :color="
                    (display.name.value == 'xs' && 'red') ||
                    (display.name.value == 'sm' && 'orange') ||
                    (display.name.value == 'md' && 'yellow') ||
                    (display.name.value == 'lg' && 'green') ||
                    (display.name.value == 'xl' && 'blue') ||
                    (display.name.value == 'xxl' && 'pink') ||
                    'black'
                  "
                >
                  <VCardTitle> useDiaplay </VCardTitle>
                  <VDivider></VDivider>
                  <VCardText>
                    {{ _.toUpper("display:")
                    }}{{ _.toUpper(display.name.value) }}
                  </VCardText>
                </VCard>
              </VCol>
              <VCol cols="12">
                <VCard variant="tonal">
                  <VCardTitle> useAppSpace </VCardTitle>
                  <VDivider></VDivider>
                  <VCardTitle>Padding</VCardTitle>
                  <VCardText>
                    <div class="border!" :class="[space.padding.all]">
                      HELLO
                    </div>
                    <div
                      class="border!"
                      :class="[space.paddingComfortable.all]"
                    >
                      HELLO
                    </div>
                    <div class="border!" :class="[space.paddingCompact.all]">
                      HELLO
                    </div>
                  </VCardText>
                  <VCardTitle>Margin</VCardTitle>
                  <VCardText>
                    <div class="border!" :class="[space.margin.all]">HELLO</div>
                    <div class="border!" :class="[space.marginComfortable.all]">
                      HELLO
                    </div>
                    <div class="border!" :class="[space.marginCompact.all]">
                      HELLO
                    </div>
                  </VCardText>
                  <VCardTitle>Font</VCardTitle>
                  <VCardText>
                    <div
                      class="border!"
                      :class="[
                        'text-xs mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-xs mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>

                    <div
                      class="border!"
                      :class="[
                        'text-sm mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-sm mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>

                    <div
                      class="border!"
                      :class="[
                        'text-md mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-md mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>

                    <div
                      class="border!"
                      :class="[
                        'text-lg mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-lg mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>

                    <div
                      class="border!"
                      :class="[
                        'text-xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>

                    <div
                      class="border!"
                      :class="[
                        'text-2xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-2xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>

                    <div
                      class="border!"
                      :class="[
                        'text-3xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-3xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>

                    <div
                      class="border!"
                      :class="[
                        'text-4xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-4xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>

                    <div
                      class="border!"
                      :class="[
                        'text-5xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
                    </div>
                    <div
                      class="border!"
                      :class="[
                        'text-5xl mb-1 font-example overflow-x-auto overflow-y-hidden w-full text-nowrap',
                      ]"
                    >
                      ا ب پ ت ث ج چ ه خ د ذ ر ز ژ س ش ص ض ط ظ ع غ ف ق ک گ ل م ن
                      و ه ی
                    </div>
                  </VCardText>
                </VCard>
              </VCol>
            </VRow>
          </VCardText>
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
import { useAppSpace } from "@/stores/application/space";

definePage({
  meta: {
    whoCanAccessThisRoute: ["public"],
  },
});

const appToast = useAppToast();

const setting = useAppSetting();

const space = useAppSpace();
const apiSchema = useApiSchemas();
const api = useApi(apiSchema.getOrigin.config, (v) => {
  return {
    cacheTime: 0,
  };
});

const display = useDisplay();
const appJwt = useAppJwt();
onMounted(() => {
  setTimeout(() => {
    appJwt.login(
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhZG1pbiIsInJvbGUiOiJhZG1pbiIsImF1ZCI6Imx5bngtZmFjZS1hdXRoIiwiaXNzIjoibHlueC1mYWNlLWF1dGgiLCJleHAiOjE3NzE3NzU3Nzd9.qKsUeB93nyiQ-eC_-7jvJ6d9o25uC7DmPbnB4AhvaiY",
    );
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
