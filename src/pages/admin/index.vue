<template>
    <div class="[&>*]:!font-[Beiruti]">
        {{ t.title }}
    </div>
</template>

<script setup lang="ts">
import { useAppSetting } from '@/stores/application/setting';
import { computed, onMounted, ref } from 'vue';
const setting = useAppSetting()
const t = computed(() => {
    return { ...setting.t.pages.dashboard, }
})

const o = ref()


</script>