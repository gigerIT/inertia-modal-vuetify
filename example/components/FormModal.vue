<template>
    <Modal max-width="lg">
        <v-card>
            <v-card-title class="text-h5">
                Form Modal Example
            </v-card-title>
            
            <v-card-text>
                <v-form ref="form" v-model="valid">
                    <v-text-field
                        v-model="name"
                        label="Name"
                        :rules="nameRules"
                        required
                        class="mb-2"
                    ></v-text-field>
                    
                    <v-text-field
                        v-model="email"
                        label="Email"
                        :rules="emailRules"
                        type="email"
                        required
                        class="mb-2"
                    ></v-text-field>
                    
                    <v-select
                        v-model="role"
                        :items="roles"
                        label="Role"
                        :rules="roleRules"
                        required
                        class="mb-2"
                    ></v-select>
                    
                    <v-textarea
                        v-model="notes"
                        label="Notes"
                        rows="3"
                        class="mb-2"
                    ></v-textarea>
                </v-form>
            </v-card-text>
            
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="grey"
                    variant="text"
                    @click="close"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="primary"
                    :disabled="!valid"
                    @click="submit"
                >
                    Submit
                </v-btn>
            </v-card-actions>
        </v-card>
    </Modal>
</template>

<script setup>
import { Modal, useModal } from '../../src/index.js'
import { ref } from 'vue'

const { close } = useModal()

const valid = ref(false)
const name = ref('')
const email = ref('')
const role = ref('')
const notes = ref('')

const nameRules = [
    v => !!v || 'Name is required',
    v => v.length >= 2 || 'Name must be at least 2 characters',
]

const emailRules = [
    v => !!v || 'Email is required',
    v => /.+@.+\..+/.test(v) || 'Email must be valid',
]

const roleRules = [
    v => !!v || 'Role is required',
]

const roles = ['Admin', 'User', 'Guest']

function submit() {
    if (valid.value) {
        alert(`Form submitted!\nName: ${name.value}\nEmail: ${email.value}\nRole: ${role.value}`)
        close()
    }
}
</script>
