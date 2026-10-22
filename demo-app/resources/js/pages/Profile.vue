<script setup lang="ts">
import { Modal } from '@inertia-vuetify/modal';
import { useForm } from '@inertiajs/vue3';

const props = defineProps<{ name: string; bio: string }>();

const form = useForm({ name: props.name, bio: props.bio });

function confirmDiscard() {
    return !form.isDirty || confirm('Discard your changes?');
}
</script>

<template>
    <Modal title="Profile" :before-close="confirmDiscard">
        <template #default>
            <v-form id="profile-form" @submit.prevent="form.put('/profile')">
                <v-text-field v-model="form.name" label="Name" :error-messages="form.errors.name" />
                <v-textarea v-model="form.bio" label="Bio" rows="3" :error-messages="form.errors.bio" />
            </v-form>
        </template>

        <template #actions="{ requestClose }">
            <v-btn variant="text" @click="requestClose">Cancel</v-btn>
            <v-btn type="submit" form="profile-form" color="primary" :loading="form.processing">Save</v-btn>
        </template>
    </Modal>
</template>
