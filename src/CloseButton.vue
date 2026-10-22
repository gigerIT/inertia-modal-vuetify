<script setup lang="ts">
import { inject } from 'vue'
import { useLocale } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { requestCloseKey } from './keys'

const requestClose = inject(requestCloseKey)
const { t } = useLocale()
</script>

<template>
    <VBtn class="im-close-button" icon="$close" variant="text" size="small" :aria-label="t('$vuetify.close')" @click="requestClose?.()" />
</template>
