<script setup lang="ts">
import { ModalLink } from '@gigerit/inertia-modal-vuetify';
</script>

<template>
    <v-app>
        <v-main>
            <v-card>
                <v-card-title>Inertia Modal Vuetify</v-card-title>
                <v-card-text>Demo</v-card-text>
                <v-list>
                    <v-list-item>
                        <ModalLink href="/test">Default</ModalLink>
                    </v-list-item>
                    <v-list-item>
                        <ModalLink href="/test" position="top">Position Top</ModalLink>
                    </v-list-item>
                    <v-list-item>
                        <ModalLink href="/test" slideover>Slideover Default (Right)</ModalLink>
                    </v-list-item>
                    <v-list-item>
                        <ModalLink href="/test" slideover position="left">Slideover Position Left</ModalLink>
                    </v-list-item>
                </v-list>
            </v-card>
        </v-main>
    </v-app>
</template>
