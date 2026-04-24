<template>
    <div class='bc-copy-text'>
        <div class="flex items-center justify-start">
            <span v-if="props.showText" class="font-mono! text-xs  px-1! py-1! rounded-lg  bg-primary-lighten-1"
                :class="[{ 'opacity-50': copied }]">{{ isSupported ?
                    _.truncate(props.data, {
                        length: props.showTextLength
                    }) : props.data }}</span>
            <span class="px-1"></span>
            <VTooltip v-if="isSupported" v-model="copied" :open-on-hover="false" location="top"
                content-class="px-1! py-0!">
                <template #activator="{ props: tooltipProps }">
                    <VBtn icon density="compact" v-bind="tooltipProps" :disabled="copied" variant="tonal"
                        color="primary" class="rounded-lg" @click="copy(props.data)">
                        <BcIcon name="copy" size="sm"></BcIcon>
                    </VBtn>
                </template>
                <template #default>Copied</template>
            </VTooltip>
        </div>
    </div>
</template>

<script setup lang='ts'>
import _ from 'lodash'
import BcIcon from './BcIcon.vue'

type IMacros = {
    props: {
        data: string,
        showTextLength?: number,
        showText?: boolean,

    },
    emits: {
        close: [data: string]
    },
    slots: {
        header(props: { data: string }): any
    },
    exposes: {
    }
}

const props = withDefaults(defineProps<IMacros['props']>(), { showTextLength: 32, showText: false, size: 'sm' });
const emits = defineEmits<IMacros['emits']>();
const slots = defineSlots<IMacros['slots']>()
defineExpose<IMacros['exposes']>({
})
defineOptions({
    name: 'BcCopyText'
})

import { useClipboard } from '@vueuse/core'
import { VBtn, VTooltip } from 'vuetify/components'
const { copied, copy, isSupported } = useClipboard()

</script>

<style scoped lang='scss'>
.bc-copy-text {}
</style>