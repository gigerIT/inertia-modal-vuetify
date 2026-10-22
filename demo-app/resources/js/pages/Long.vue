<script setup lang="ts">
import { Modal } from '@inertia-vuetify/modal';
</script>

<template>
    <Modal title="Long content" max-width="lg">
        <p v-for="n in 50" :key="n" class="mb-2">Paragraph {{ n }}</p>
    </Modal>
</template>
