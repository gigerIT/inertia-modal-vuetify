<template>
    <Modal>
        <v-card>
            <v-card-title class="text-h5">
                Basic Modal Example
            </v-card-title>
            
            <v-card-text>
                <p>This is a basic modal using the Inertia Modal Vuetify package.</p>
                <p class="mt-2">
                    The modal is styled with Vuetify components and maintains the same
                    API as the original @inertiaui/modal-vue package.
                </p>
            </v-card-text>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="primary"
                    variant="text"
                    @click="close"
                >
                    Close
                </v-btn>
            </v-card-actions>
        </v-card>
    </Modal>
</template>

<script setup>
import { Modal, useModal } from '../../src/index.js'

const { close } = useModal()
</script>
