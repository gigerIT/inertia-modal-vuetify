<script setup lang="ts">
import { Modal, ModalLink } from '@gigerit/inertia-modal-vuetify';
import { useTheme } from 'vuetify';
import { VBtn } from 'vuetify/components';

const theme = useTheme();

const links = [
    { label: 'Modal', href: '/profile' },
    { label: 'Top', href: '/profile', position: 'top' },
    { label: 'Bottom', href: '/profile', position: 'bottom' },
    { label: 'Slideover', href: '/profile', slideover: true },
    { label: 'Slideover left', href: '/profile', slideover: true, position: 'left' },
    { label: 'Close explicitly', href: '/profile', closeExplicitly: true },
    { label: 'No outside close', href: '/profile', closeOnClickOutside: false },
    { label: 'Navigate', href: '/profile', navigate: true },
    { label: 'Nested', href: '/nested' },
    { label: 'Long content', href: '/long' },
    { label: 'Local', href: '#local' },
];
</script>

<template>
    <v-app>
        <v-app-bar title="Inertia Modal Vuetify">
            <template #append>
                <v-btn icon="mdi-theme-light-dark" aria-label="Toggle theme" @click="theme.toggle()" />
            </template>
        </v-app-bar>

        <v-main>
            <v-container style="min-height: 200vh">
                <div class="d-flex flex-wrap ga-3">
                    <ModalLink v-for="{ label, ...link } in links" :key="label" v-bind="link" :as="VBtn">
                        {{ label }}
                    </ModalLink>
                </div>
            </v-container>
        </v-main>

        <Modal name="local" v-slot="{ close }">
            <h2 class="text-h6 mb-2">Local</h2>
            <p>Rendered without a route.</p>
            <div class="d-flex justify-end mt-4">
                <v-btn color="primary" @click="close">Done</v-btn>
            </div>
        </Modal>
    </v-app>
</template>
