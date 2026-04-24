<template>
  <FontProvider
    :font-family="setting.currentFont.key"
    :write-on-outside-of-app="true"
  >
    <VLocaleProvider :locale="setting.currentLanguage?.key">
      <VThemeProvider :theme="setting.currentTheme">
        <VApp :class="{ [`theme-${setting.currentTheme}`]: true }">
          <Toast>
            <BcAppDisable>
              <VMain>
                <template #default>
                  <VFadeTransition>
                    <router-view />
                  </VFadeTransition>
                </template>
              </VMain>
              <VDialog v-model="setting.clearCacheDialog" max-width="550px">
                <VCard>
                  <BcPageTitle
                    :border-side="{ top: true }"
                    class="text-warning"
                    title="Clear Cache"
                  ></BcPageTitle>
                  <VDivider></VDivider>
                  <VCardText>
                    Are You Sure You Want Delete Website Cache ?
                  </VCardText>
                  <VDivider></VDivider>
                  <VCardActions>
                    <VBtn
                      color="warning"
                      variant="elevated"
                      :loading="cache.loading.value"
                      @click="cache.clear()"
                      >YES</VBtn
                    >
                    <VBtn @click="setting.clearCacheDialog = false">NO</VBtn>
                  </VCardActions>
                </VCard>
              </VDialog>
            </BcAppDisable>
          </Toast>
        </VApp>
      </VThemeProvider>
    </VLocaleProvider>
  </FontProvider>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import FontProvider from "./components/provider/FontProvider.vue";
import { useAppSetting } from "./stores/application/setting";
import {
  VApp,
  VLocaleProvider,
  VMain,
  VThemeProvider,
} from "vuetify/components";
import { useCache } from "./composables/cache";
import Toast from "./components/base/Toast.vue";
import BcAppDisable from "./components/base/BcAppDisable.vue";
const setting = useAppSetting();
const cache = useCache({
  onFinished: () => {
    setting.clearCacheDialog = false;
    cache.showCacheClearedMessage();
  },
});

onMounted(() => {});
</script>
