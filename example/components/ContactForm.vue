<script setup lang="ts">
import { computed, ref } from 'vue'
import { Modal } from '../../src'

const name = ref('')
const message = ref('')
const dirty = computed(() => !!(name.value || message.value))
const required = [(value: string) => !!value || 'Required']

function confirmDiscard() {
    return !dirty.value || confirm('Discard your message?')
}

function reset() {
    name.value = ''
    message.value = ''
}
</script>

<template>
    <Modal name="contact" title="Contact" :before-close="confirmDiscard" @after-leave="reset">
        <template #default="{ close }">
            <v-form id="contact-form" @submit.prevent="close">
                <v-text-field v-model="name" label="Name" :rules="required" />
                <v-textarea v-model="message" label="Message" rows="3" />
            </v-form>
        </template>

        <template #actions="{ requestClose }">
            <v-btn variant="text" @click="requestClose">Cancel</v-btn>
            <v-btn type="submit" form="contact-form" color="primary">Send</v-btn>
        </template>
    </Modal>
</template>
