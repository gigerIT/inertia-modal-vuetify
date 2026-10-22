<script setup>
import { ref } from 'vue'
import { useModal } from '../../src/index.js'

const modal = useModal()
const valid = ref(false)
const required = [(value) => !!value || 'Required']
</script>

<template>
    <h2 class="text-h6 mb-4">Contact</h2>

    <v-form v-model="valid" @submit.prevent="modal.close()">
        <v-text-field label="Name" :rules="required" />
        <v-text-field label="Email" type="email" :rules="required" />
        <v-textarea label="Message" rows="3" />

        <div class="d-flex justify-end ga-2">
            <v-btn variant="text" @click="modal.close()">Cancel</v-btn>
            <v-btn type="submit" color="primary" :disabled="!valid">Send</v-btn>
        </div>
    </v-form>
</template>
