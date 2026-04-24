<template>
  <VCard variant="text">
    <VCardTitle class=" p-2!">
      <div class="text-[22vw] leading-[20svw] font-mono! text-tw-background text-color text-shadow-lg border-black">403
      </div>
    </VCardTitle>
    <VCardText class="text-[2vw]! font-bold font-mono! p-2! text-tw-primary">
      <BcIcon size="xs" name="hashtag" class="me-2"></BcIcon>
      <span>Access Denied</span>
    </VCardText>
    <VCardText class="text-[1.5vw]! font-mono! p-2!">
      You don’t have permission to access this Page.
    </VCardText>
    <VCardActions class=" p-2!" :class="{ 'flex-wrap': display.mdAndDown.value }">
      <VBtn :block="display.mdAndDown.value" :size="display.mdAndDown.value ? 'small' : 'default'" variant="elevated"
        color="primary" @click="router.push('/log/authChecker')">{{ role == 'guest' ? 'login' : 'DASHBOARD' }}</VBtn>
      <VBtn @click="router.back()" :block="display.mdAndDown.value"
        :size="display.mdAndDown.value ? 'small' : 'default'" variant="outlined" color="primary">BACK</VBtn>
    </VCardActions>
  </VCard>
</template>


<script setup lang="ts">
import { useTheme } from 'vuetify/lib/composables/theme.mjs';

definePage({
  meta: {
    whoCanAccessThisRoute: ["public"],
  },
});
import { computed, onMounted } from 'vue';
import { useAppSetting } from '@/stores/application/setting';
import { useDisplay } from '@/composables/display';
import { useAppJwt } from '@/stores/application/jwt';
import { useRouter } from 'vue-router';
const theme = useTheme();
const textColor = computed(() => {
  return theme.current.value.colors.primary
})

const display = useDisplay()
const { role } = useAppJwt()
const router = useRouter()
onMounted(() => {
  // setInterval(() => {
  //   if (setting.defaults.themeMode == 'dark') {
  //     setting.defaults.themeMode = 'light'
  //   } else {
  //     setting.defaults.themeMode = 'dark'
  //   }
  // }, 2000);
})

</script>


<style lang="scss" scoped>
.text-color {
  color: v-bind('textColor');
}
</style>
