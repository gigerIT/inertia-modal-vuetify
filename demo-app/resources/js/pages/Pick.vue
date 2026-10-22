<script setup lang="ts">
import { Modal } from '@inertia-vuetify/modal';

const colors = ['Red', 'Blue'];
</script>

<template>
    <Modal v-slot="{ emit, close }" title="Pick a color">
        <div class="d-flex ga-2">
            <v-btn
                v-for="color in colors"
                :key="color"
                @click="
                    emit('picked', color);
                    close();
                "
            >
                {{ color }}
            </v-btn>
        </div>
    </Modal>
</template>
