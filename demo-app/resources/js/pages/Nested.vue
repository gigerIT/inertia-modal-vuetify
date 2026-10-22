<script setup lang="ts">
import { Modal, ModalLink } from '@gigerit/inertia-modal-vuetify';
import { VBtn } from 'vuetify/components';
</script>

<template>
    <Modal>
        <h2 class="text-h6 mb-4">Nested</h2>
        <ModalLink href="/profile" :as="VBtn" color="primary">Open profile</ModalLink>
    </Modal>
</template>
