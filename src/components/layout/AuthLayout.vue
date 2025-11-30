<template>
    <div class="auth-layout h-[100svh] flex items-center justify-center">
        <VSlideYTransition>
            <RouterView></RouterView>
        </VSlideYTransition>
    </div>
</template>
<script setup lang="ts">
import { VSlideYTransition } from 'vuetify/components';

</script>
<style lang="scss" scoped>
.auth-layout {}
</style>