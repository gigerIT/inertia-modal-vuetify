<script setup lang="ts">
import { computed, inject, type Ref } from 'vue'
import type { ModalContext } from './types'

const props = defineProps<{ data: string | string[] }>()

defineSlots<{ default?(): unknown; fallback?(): unknown }>()

const modalContext = inject<Ref<ModalContext | null>>('modalContext')

if (!modalContext) {
    throw new Error('Deferred component must be used inside a Modal component')
}

const allKeysAreAvailable = computed(() => [props.data].flat().every((key) => modalContext.value?.props[key] !== undefined))
</script>

<template>
    <slot v-if="allKeysAreAvailable" />
    <slot v-else name="fallback" />
</template>
