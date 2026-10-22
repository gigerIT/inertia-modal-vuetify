<script setup lang="ts">
import { Modal, ModalBtn } from '@inertia-vuetify/modal';
import { useTheme } from 'vuetify';

const theme = useTheme();

const links = [
    { label: 'Modal', href: '/profile' },
    { label: 'Top', href: '/profile', position: 'top' },
    { label: 'Bottom', href: '/profile', position: 'bottom' },
    { label: 'Slideover', href: '/profile', slideover: true },
    { label: 'Slideover left', href: '/profile', slideover: true, position: 'left' },
    { label: 'Bottom sheet', href: '/profile', slideover: true, position: 'bottom' },
    { label: 'Close explicitly', href: '/profile', closeExplicitly: true },
    { label: 'No outside close', href: '/profile', closeOnClickOutside: false },
    { label: 'Navigate', href: '/profile', navigate: true },
    { label: 'Prefetched', href: '/profile', prefetch: true },
    { label: 'Prefetched navigate', href: '/profile', prefetch: true, navigate: true },
    { label: 'Nested', href: '/nested' },
    { label: 'Long content', href: '/long' },
    { label: 'Stats', href: '/stats' },
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
                    <ModalBtn v-for="{ label, ...link } in links" :key="label" v-bind="link">{{ label }}</ModalBtn>
                </div>
            </v-container>
        </v-main>

        <Modal name="local" title="Local">
            <p>Rendered without a route.</p>

            <template #actions="{ close }">
                <v-btn color="primary" @click="close">Done</v-btn>
            </template>
        </Modal>
    </v-app>
</template>
