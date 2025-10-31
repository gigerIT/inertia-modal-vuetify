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
        @click="close"
    >
        <v-icon>mdi-close</v-icon>
        <span class="sr-only">Close</span>
    </v-btn>
</template>

<style scoped>
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
}
</style>

