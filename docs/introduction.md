# Introduction

This package is a Vuetify adapter for [InertiaUI Modal](https://inertiaui.com/modal). With it, you can open any route in a Vuetify-styled Modal or Slideover without changing your existing routes or controllers.

Here's a summary of the features:

- Supports Vue 3 and Vuetify 4
- Zero backend configuration
- Super simple frontend API
- Support for Base Route / URL
- Modal and slideover support
- Headless support
- Nested/stacked modals support
- Reusable modals
- Multiple sizes and positions
- Reload props in modals
- Easy communication between nested/stacked modals
- Highly configurable

## Example

The package comes with two components: `Modal` and `ModalLink`. `ModalLink` is very similar to Inertia's [built-in `Link` component](https://inertiajs.com/links), but it opens the linked route in a modal instead of a full page load. So, if you have a link that you want to open in a modal, you can simply replace `Link` with `ModalLink`.

```vue
<script setup>
import { ModalLink } from '@gigerit/inertia-modal-vuetify'
</script>

<template>
    <ModalLink href="/users/create">Create User</ModalLink>
</template>
```

The page you linked can then use the `Modal` component to wrap its content in a modal.

```vue
<script setup>
import { Modal } from '@gigerit/inertia-modal-vuetify'
</script>

<template>
    <Modal>
        <h1>Create User</h1>
        <form>
            <!-- Form fields -->
        </form>
    </Modal>
</template>
```

That's it! There is no need to change anything about your routes or controllers!
