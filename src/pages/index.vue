<template>
  <VContainer>
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
      <VCard class="w-full">
        <VCardTitle>Card</VCardTitle>
        <VDivider></VDivider>
        <VCardText>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsum placeat tempora at quia molestiae aspernatur
          distinctio!
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
      </VCard>
    </VRow>
  </VContainer>


</template>

<script lang="ts" setup>
import { useAppSetting } from '@/stores/application/setting';
import kmIcon from 'km-icon';
import _ from 'lodash';
import { onMounted } from 'vue';
const setting = useAppSetting();

onMounted(() => {

})

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
