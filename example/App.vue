<script setup>
import { useTheme } from 'vuetify'
import { VBtn } from 'vuetify/components/VBtn'
import { Modal, ModalLink } from '../src/index.js'
import ContactForm from './components/ContactForm.vue'

const theme = useTheme()

const links = [
    { label: 'Modal', href: '#modal' },
    { label: 'Top', href: '#modal', position: 'top' },
    { label: 'Bottom', href: '#modal', position: 'bottom' },
    { label: '4xl', href: '#modal', maxWidth: '4xl' },
    { label: 'Slideover', href: '#modal', slideover: true },
    { label: 'Slideover left', href: '#modal', slideover: true, position: 'left' },
    { label: 'Close explicitly', href: '#form', closeExplicitly: true },
    { label: 'No outside close', href: '#modal', closeOnClickOutside: false },
    { label: 'Long content', href: '#long' },
    { label: 'Nested', href: '#nested' },
]
</script>

<template>
    <v-app>
        <v-main>
            <v-container>
                <div class="d-flex align-center mb-6">
                    <h1 class="text-h5">Inertia Modal Vuetify</h1>
                    <v-spacer />
                    <v-btn icon="mdi-theme-light-dark" variant="text" aria-label="Toggle theme" @click="theme.toggle()" />
                </div>

                <div class="d-flex flex-wrap ga-3">
                    <ModalLink v-for="{ label, ...link } in links" :key="label" v-bind="link" :as="VBtn">
                        {{ label }}
                    </ModalLink>
                </div>
            </v-container>
        </v-main>

        <Modal name="modal" v-slot="{ close }">
            <h2 class="text-h6 mb-2">Hello</h2>
            <p>This content is rendered inside a Vuetify dialog.</p>
            <div class="d-flex justify-end mt-4">
                <v-btn color="primary" @click="close">Done</v-btn>
            </div>
        </Modal>

        <Modal name="form">
            <ContactForm />
        </Modal>

        <Modal name="long">
            <h2 class="text-h6 mb-2">Long content</h2>
            <p v-for="n in 40" :key="n" class="mb-2">Paragraph {{ n }}</p>
        </Modal>

        <Modal name="nested">
            <h2 class="text-h6 mb-4">Parent</h2>
            <ModalLink href="#modal" :as="VBtn" color="primary">Open child</ModalLink>
        </Modal>
    </v-app>
</template>
