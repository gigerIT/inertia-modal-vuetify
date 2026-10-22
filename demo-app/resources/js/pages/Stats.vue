<script setup lang="ts">
import { Deferred, Modal } from '@inertia-vuetify/modal';

defineProps<{ time: string; visits?: number }>();
</script>

<template>
    <Modal title="Stats">
        <p>
            Updated <span class="time">{{ time }}</span>
        </p>

        <Deferred data="visits">
            <template #fallback>
                <v-progress-linear indeterminate class="mt-4" />
            </template>

            <p class="mt-4">{{ visits }} visits</p>
        </Deferred>

        <template #actions="{ reload }">
            <v-btn prepend-icon="mdi-refresh" @click="reload({ only: ['time'] })">Refresh</v-btn>
        </template>
    </Modal>
</template>
