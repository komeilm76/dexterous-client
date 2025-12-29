<template>
  <FontProvider :font-family="setting.currentFont.key" :write-on-outside-of-app="true">
    <VLocaleProvider :locale="setting.currentLanguage?.key">
      <VThemeProvider :theme="setting.currentTheme">
        <v-app :class="{ [`theme-${setting.currentTheme}`]: true }">
          <v-main>
            <template #default>
              <router-view />
            </template>
          </v-main>
        </v-app>
      </VThemeProvider>
    </VLocaleProvider>
  </FontProvider>
</template>


<script lang="ts" setup>
import { onMounted } from 'vue';
import FontProvider from './components/provider/FontProvider.vue';
import { useAppSetting } from './stores/application/setting';
const setting = useAppSetting()


onMounted(() => {
})


</script>