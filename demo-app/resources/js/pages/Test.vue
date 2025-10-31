<script setup lang="ts">
import { Modal } from '@gigerit/inertia-modal-vuetify';
</script>

<template>
    <Modal>
        <v-container class="pa-md-6" fluid>
            <v-card flat>
                <v-card-text>
                    <v-form>
                        <v-row dense>
                            <v-col cols="12">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">Nickname</label>

                                <v-text-field v-model="nickname" density="comfortable" placeholder="Enter your nickname" variant="outlined" />
                            </v-col>

                            <v-col cols="12">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">Avatar</label>

                                <div class="d-flex align-center ga-4">
                                    <v-avatar
                                        color="surface-variant"
                                        image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
                                        size="96"
                                    />

                                    <v-btn prepend-icon="mdi-cloud-upload-outline" text="Upload Image" variant="outlined" />
                                </div>
                            </v-col>

                            <v-col cols="12">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">Bio</label>

                                <v-textarea
                                    v-model="bio"
                                    density="comfortable"
                                    placeholder="Write something about yourself"
                                    rows="4"
                                    variant="outlined"
                                />
                            </v-col>

                            <v-col cols="12" md="6">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">Email</label>

                                <v-text-field v-model="email" density="comfortable" placeholder="Enter your email" type="email" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="6">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">Country</label>

                                <v-select
                                    v-model="country"
                                    density="comfortable"
                                    :items="['United States', 'Canada', 'Mexico']"
                                    placeholder="Select a country"
                                    variant="outlined"
                                />
                            </v-col>

                            <v-col cols="12" md="6">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">City</label>

                                <v-text-field v-model="city" density="comfortable" placeholder="Enter your city" variant="outlined" />
                            </v-col>

                            <v-col cols="12" md="6">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">State</label>

                                <v-text-field v-model="state" density="comfortable" placeholder="Enter your state" variant="outlined" />
                            </v-col>

                            <v-col cols="12">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">Website</label>

                                <v-text-field
                                    v-model="website"
                                    density="comfortable"
                                    hide-details
                                    persistent-placeholder
                                    placeholder="www.example.com"
                                    prefix="https://"
                                    variant="outlined"
                                />
                            </v-col>

                            <v-col cols="12">
                                <label class="text-subtitle-1 font-weight-medium mb-2 d-block">Privacy</label>

                                <v-checkbox v-model="privacy" density="comfortable" label="Share my data with contacts" />
                            </v-col>

                            <v-col cols="12">
                                <v-btn color="primary" size="large" text="Save Changes" />
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
            </v-card>
        </v-container>
    </Modal>
</template>
