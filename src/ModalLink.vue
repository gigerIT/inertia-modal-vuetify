<!-- Re-export ModalLink from @inertiaui/modal-vue since it doesn't need styling changes -->
<script setup>
import { ModalLink as OriginalModalLink } from '@inertiaui/modal-vue'

// Re-export all props
defineOptions({
    inheritAttrs: false,
})
</script>

<template>
    <OriginalModalLink v-bind="$attrs">
        <slot />
    </OriginalModalLink>
</template>

