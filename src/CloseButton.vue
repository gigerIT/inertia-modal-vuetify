<script setup>
import { inject, toValue } from 'vue'
import { useLocale } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'

// Resolved on click: the provided context can change while this button stays mounted.
const modalContext = inject('modalContext', null)
const { t } = useLocale()
</script>

<template>
    <VBtn
        class="im-close-button"
        icon="$close"
        variant="text"
        size="small"
        :aria-label="t('$vuetify.close')"
        @click="toValue(modalContext)?.close()"
    />
</template>
