<template>
    <Modal slideover>
        <v-card class="h-100">
            <v-card-title class="text-h5">
                Slideover Example
            </v-card-title>
            
            <v-card-text>
                <p>This is a slideover (drawer-style) modal.</p>
                <p class="mt-2">
                    Slideovers slide in from the side (left or right) and are
                    perfect for navigation or secondary content.
                </p>
                
                <v-list class="mt-4">
                    <v-list-item
                        v-for="item in items"
                        :key="item.title"
                        :title="item.title"
                        :subtitle="item.subtitle"
                    >
                        <template v-slot:prepend>
                            <v-icon>{{ item.icon }}</v-icon>
                        </template>
                    </v-list-item>
                </v-list>
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
import { ref } from 'vue'

const { close } = useModal()

const items = ref([
    { title: 'Home', subtitle: 'Go to home page', icon: 'mdi-home' },
    { title: 'Settings', subtitle: 'Configure your settings', icon: 'mdi-cog' },
    { title: 'Profile', subtitle: 'View your profile', icon: 'mdi-account' },
])
</script>
