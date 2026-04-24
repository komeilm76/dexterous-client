<template>
  <AuthLayout></AuthLayout>
</template>
<script setup lang="ts">
import AuthLayout from "@/components/layout/AuthLayout.vue";
definePage({
  meta: {
    whoCanAccessThisRoute: ["admin", "operator"],
  },
});
</script>
<style lang="sass" scoped></style>
