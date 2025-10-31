<script setup>
import { inject, toValue } from 'vue'

const modalContext = inject('modalContext', null)

function close() {
    const context = toValue(modalContext)
    if (context?.close) {
        context.close()
    }
}
</script>

<template>
    <v-btn
        icon
        variant="text"
        size="small"
        class="im-close-button"
        aria-label="Close"
        @click="close"
    >
        <v-icon>mdi-close</v-icon>
    </v-btn>
</template>

