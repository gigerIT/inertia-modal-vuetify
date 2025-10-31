<template>
    <div>
        <v-card class="pa-6">
            <v-card-title class="text-h5 mb-4">
                Modal Examples
            </v-card-title>
            
            <v-card-text>
                <p class="mb-4">
                    Click the buttons below to see different modal examples:
                </p>
                
                <v-row>
                    <v-col cols="12" md="6">
                        <v-card variant="outlined" class="pa-4">
                            <v-card-title class="text-h6 mb-2">Basic Modal</v-card-title>
                            <v-card-text>
                                <ModalLink href="#basic-modal">
                                    <v-btn color="primary">
                                        Open Basic Modal
                                    </v-btn>
                                </ModalLink>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                        <v-card variant="outlined" class="pa-4">
                            <v-card-title class="text-h6 mb-2">Slideover</v-card-title>
                            <v-card-text>
                                <ModalLink href="#slideover-modal" slideover>
                                    <v-btn color="primary">
                                        Open Slideover
                                    </v-btn>
                                </ModalLink>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                        <v-card variant="outlined" class="pa-4">
                            <v-card-title class="text-h6 mb-2">Large Modal</v-card-title>
                            <v-card-text>
                                <ModalLink href="#large-modal" max-width="4xl">
                                    <v-btn color="primary">
                                        Open Large Modal (4xl)
                                    </v-btn>
                                </ModalLink>
                            </v-card-text>
                        </v-card>
                    </v-col>
                    
                    <v-col cols="12" md="6">
                        <v-card variant="outlined" class="pa-4">
                            <v-card-title class="text-h6 mb-2">Modal with Form</v-card-title>
                            <v-card-text>
                                <ModalLink href="#form-modal" max-width="lg">
                                    <v-btn color="primary">
                                        Open Form Modal
                                    </v-btn>
                                </ModalLink>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>
        
        <!-- Local Modals -->
        <Modal name="basic-modal">
            <BasicModal />
        </Modal>
        
        <Modal name="slideover-modal" slideover>
            <SlideoverModal />
        </Modal>
        
        <Modal name="large-modal" max-width="4xl">
            <LargeModal />
        </Modal>
        
        <Modal name="form-modal" max-width="lg">
            <FormModal />
        </Modal>
    </div>
</template>

<script setup>
import { Modal, ModalLink } from '../../src/index.js'
import BasicModal from '../components/BasicModal.vue'
import SlideoverModal from '../components/SlideoverModal.vue'
import LargeModal from '../components/LargeModal.vue'
import FormModal from '../components/FormModal.vue'
</script>
