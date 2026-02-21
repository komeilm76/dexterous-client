<script setup lang="ts">
import { VTextField } from "vuetify/components";
definePage({
  meta: {
    whoCanAccessThisRoute: ["public"],
  },
});
</script>

<template>
  <VRow>
    <VCol cols="6" class="!p-8 bg-tw-background">
      <VCard>
        <VCardTitle>Fields</VCardTitle>
        <VDivider></VDivider>
        <VCardText class="[&>*]:!m-2">
          <VTextField></VTextField>
          <VTextarea></VTextarea>
          <VSelect></VSelect>
          <VCombobox></VCombobox>
          <VCheckbox></VCheckbox>
          <VRadio></VRadio>
          <VSwitch></VSwitch>
        </VCardText>
        <VDivider></VDivider>
        <VCardActions class="flex-wrap">
          <!-- <VBtn>submit</VBtn> -->
          <VBtn block>submit</VBtn>
          <VBtn block color="primary">submit</VBtn>
          <VBtn block color="secondary" variant="tonal">submit</VBtn>
        </VCardActions>
      </VCard>
    </VCol>
    <VCol cols="6" class="!p-8">
      <VCard>
        <VCardTitle>Cards</VCardTitle>
        <VDivider></VDivider>
        <VCardText class="[&>*]:!m-2">
          <v-alert
            text="Lorem ipsum dolor sit amet consectetur adipisicing elit. Commodi, ratione debitis quis est labore voluptatibus! Eaque cupiditate minima, at placeat totam, magni doloremque veniam neque porro libero rerum unde voluptatem!"
            title="Alert title"
          ></v-alert>
        </VCardText>
        <VDivider></VDivider>
        <VCardActions> </VCardActions>
      </VCard>
    </VCol>
  </VRow>
</template>
