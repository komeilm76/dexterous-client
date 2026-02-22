<template>
  <FontProvider :font-family="setting.currentFont.key" :write-on-outside-of-app="true">
    <VLocaleProvider :locale="setting.currentLanguage?.key">
      <VThemeProvider :theme="setting.currentTheme">
        <VApp :class="{ [`theme-${setting.currentTheme}`]: true }">
          <VMain>
            <template #default>
              <router-view />
            </template>
          </VMain>
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
const setting = useAppSetting();

onMounted(() => { });
</script>
