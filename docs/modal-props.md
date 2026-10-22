# Modal Props

Just like regular Inertia pages, modals can also receive props. This works similarly to how you would pass props to a regular Inertia page. Let's say you have a modal for editing a user:

```php
return Inertia::render('EditUser', [
    'roles' => Role::pluck('name', 'id'),
    'user' => $user,
]);
```

Then, in your modal component, you can access these props:

```vue
<script setup>
defineProps({ roles: Object, user: Object })
</script>

<template>
    <div>
        <h1>Edit User {{ user.name }}</h1>
        <form>
            <!-- ... -->
        </form>
    </div>
</template>
```

## Accessing Props using `useModal`

If you're using child components within your modal, you can pass props to them, but you can also access the modal's props using the `useModal` hook. This is useful when you need to access the modal's props in a child component that is not directly receiving them as props.

```vue
<script setup>
import { useModal } from '@inertia-vuetify/modal'

const { props } = useModal()
</script>

<template>
    <p>User Status: {{ props.user.status }}</p>
</template>
```