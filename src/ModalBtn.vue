<script setup lang="ts">
import { ref } from 'vue'
import { VBtn } from 'vuetify/components/VBtn'
import ModalLink from './ModalLink.vue'

defineOptions({ inheritAttrs: false })

defineProps<{ href: string }>()

defineSlots<{ default?(props: { loading: boolean }): unknown }>()

const loading = ref(false)
</script>

<template>
    <ModalLink v-bind="$attrs" :as="VBtn" :href :loading @start="loading = true" @success="loading = false" @error="loading = false">
        <template v-if="$slots.default" #default="slotProps">
            <slot v-bind="slotProps" />
        </template>
    </ModalLink>
</template>
