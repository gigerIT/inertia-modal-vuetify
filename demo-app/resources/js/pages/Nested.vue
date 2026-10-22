<script setup lang="ts">
import { Modal, ModalBtn } from '@inertia-vuetify/modal';
import { ref } from 'vue';

const picked = ref<string>();
</script>

<template>
    <Modal title="Nested">
        <div class="d-flex ga-2">
            <ModalBtn href="/profile" color="primary">Open profile</ModalBtn>
            <ModalBtn href="/pick" @picked="(color: string) => (picked = color)">Pick a color</ModalBtn>
        </div>

        <p v-if="picked" class="mt-4">Picked {{ picked }}</p>
    </Modal>
</template>
