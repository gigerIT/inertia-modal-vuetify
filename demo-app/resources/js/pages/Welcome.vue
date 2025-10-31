<script setup lang="ts">
import { ModalLink } from '@gigerit/inertia-modal-vuetify';
</script>

<template>
    <v-app>
        <v-main>
            <v-card>
                <v-card-title>Welcome</v-card-title>
                <v-card-text>Welcome</v-card-text>
                <v-card-actions>
                    <ModalLink href="/test"> Test </ModalLink>
                </v-card-actions>
            </v-card>
        </v-main>
    </v-app>
</template>
