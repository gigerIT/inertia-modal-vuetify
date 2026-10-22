<script setup lang="ts">
import { Modal } from '@gigerit/inertia-modal-vuetify';
</script>

<template>
    <Modal max-width="lg">
        <h2 class="text-h6 mb-4">Long content</h2>
        <p v-for="n in 50" :key="n" class="mb-2">Paragraph {{ n }}</p>
    </Modal>
</template>
