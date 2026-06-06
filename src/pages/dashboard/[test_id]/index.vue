<template></template>

<script setup lang="ts">
import { useApiSchemas } from "@/apis";
import { useApi } from "@/composables/api";
import { onMounted } from "vue";
import { useRoute } from "vuetify/lib/composables/router.mjs";

const route = useRoute();

onMounted(() => {
  if (route.value?.name == "/dashboard/[test_id]/") {
    route.value.params.test_id;
  }
});

const apiSchema = useApiSchemas().v1.routes.posts.create.apiSchema;
const api = useApi(apiSchema, () => {});
api._onSuccess({});
api._onError({});
api._onResponse({});
</script>
