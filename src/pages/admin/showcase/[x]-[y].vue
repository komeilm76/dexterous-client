<template>
    <div v-if="route.name == '/admin/showcase/[x]-[y]'">
        {{ route.params.x }} - {{ route.params.y }}
    </div>
</template>
<script lang="ts" setup>
import { useRoute } from 'vue-router';

definePage({
    alias: ['/a/s/:x-:y'],
    meta: {
        requiresAuth: true
    },
  
})

const route = useRoute();

</script>