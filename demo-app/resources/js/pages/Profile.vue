<script setup lang="ts">
import { Modal } from '@gigerit/inertia-modal-vuetify';
import { useForm } from '@inertiajs/vue3';

const props = defineProps<{ name: string; bio: string }>();

const form = useForm({ name: props.name, bio: props.bio });
</script>

<template>
    <Modal v-slot="{ close }">
        <h2 class="text-h6 mb-4">Profile</h2>

        <v-form @submit.prevent="form.put('/profile', { onSuccess: () => close() })">
            <v-text-field v-model="form.name" label="Name" :error-messages="form.errors.name" />
            <v-textarea v-model="form.bio" label="Bio" rows="3" :error-messages="form.errors.bio" />

            <div class="d-flex justify-end ga-2">
                <v-btn variant="text" @click="close">Cancel</v-btn>
                <v-btn type="submit" color="primary" :loading="form.processing">Save</v-btn>
            </div>
        </v-form>
    </Modal>
</template>
