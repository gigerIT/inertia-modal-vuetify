<script setup lang="ts">
import { computed, provide } from 'vue'
import { only } from './helpers'
import { useModalStack } from './modalStack'

const props = defineProps<{ index: number }>()

const modalStack = useModalStack()
const modalContext = computed(() => modalStack.stack.value[props.index])

provide('modalContext', modalContext)
</script>

<template>
    <component
        :is="modalContext.component"
        v-if="modalContext?.component"
        v-bind="only(modalContext.props, modalContext.getComponentPropKeys(), true)"
        @modal-event="(event: string, ...args: unknown[]) => modalContext.emit(event, ...args)"
    />
</template>
