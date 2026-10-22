# Close Modal

By default, both the modal and slideover components have a close button. You can hide this button by using the `close-button` prop, as documented in the [Configuration](/configuration) section. To close the modal programmatically, you can use the `close` method provided by the `Modal` component.

```vue
<template>
    <Modal v-slot="{ close }">
        <button type="button" @click="close">Close</button>
    </Modal>
</template>
```

## Preventing the Modal from Closing

Pass a `before-close` function to ask before discarding unsaved changes. It runs when the user clicks the close button, presses Escape, or clicks the backdrop, and when you call the `requestClose` slot prop. Return `false`, or a promise that resolves to `false`, to keep the modal open. `close` skips the check, and so does the automatic close when a submission redirects back to the page under the modal.

```vue
<script setup>
import { useForm } from '@inertiajs/vue3'

const form = useForm({ name: '' })

const confirmDiscard = () => !form.isDirty || confirm('Discard your changes?')
</script>

<template>
    <Modal title="Edit" :before-close="confirmDiscard">
        <!-- Form -->

        <template #actions="{ requestClose }">
            <v-btn @click="requestClose">Cancel</v-btn>
            <v-btn color="primary" @click="form.post('/users')">Save</v-btn>
        </template>
    </Modal>
</template>
```

## Using a Ref

You can also use the `ref` attribute to get a reference to the modal component and call the `close` method on it.

```vue
<script setup>
import { ref } from 'vue';

const modalRef = ref(null);

function closeModal() {
    modalRef.value.close();
}
</script>

<template>
    <Modal ref="modalRef">
        <!-- ... -->
    </Modal>
</template>
```