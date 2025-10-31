<template>
    <Modal max-width="4xl">
        <v-card>
            <v-card-title class="text-h5">
                Large Modal Example
            </v-card-title>
            
            <v-card-text>
                <p>This modal uses a larger max-width (4xl).</p>
                <p class="mt-2">
                    You can control the modal size using the <code>max-width</code> prop.
                    Available sizes: sm, md, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl, 7xl
                </p>
                
                <v-data-table
                    :headers="headers"
                    :items="items"
                    class="mt-4"
                ></v-data-table>
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

const headers = ref([
    { title: 'Name', key: 'name' },
    { title: 'Email', key: 'email' },
    { title: 'Role', key: 'role' },
])

const items = ref([
    { name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
    { name: 'Bob Johnson', email: 'bob@example.com', role: 'User' },
])
</script>
