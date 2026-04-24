<template>
    <div class="w-full flex! items-center justify-center flex-col">
        <VProgressLinear color="primary" class="max-w-[200px]!" v-model="remainingPercent"></VProgressLinear>
        <div class="my-4 font-bold tracking-widest">PLEASE WAIT...</div>
    </div>
</template>
<script setup lang="ts">
import { useAppJwt } from '@/stores/application/jwt';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
const appJwt = useAppJwt();
const router = useRouter();
import { useCountdown } from '@vueuse/core'
import tools from '@/tools';
const delay = ref(1600);
const interval = ref(100);
const { remaining, start } = useCountdown(delay.value / interval.value, {
    interval: interval.value,
    async onComplete() {
        await tools.time.wait(400);
        if (appJwt.role == 'admin') {
            router.push('/admin')
        } else if (appJwt.role == 'operator') {
            router.push('/admin')

        } else {
            router.push('/auth')
        }
    },
})

const remainingPercent = computed(() => {
    const totalTime = delay.value;
    return (
        100 - (remaining.value * interval.value * 100) /
        totalTime
    ).toFixed();
});


onMounted(() => {
    start()
})

definePage({
    meta: {
        whoCanAccessThisRoute: ['public']
    }
})

</script>