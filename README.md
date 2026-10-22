# @gigerit/inertia-modal-vuetify

A Vuetify-styled drop-in replacement for [@inertiaui/modal-vue](https://github.com/inertiaui/modal). Routing, the modal stack, local modals, deferred props and every other behavior come from the upstream package; this package renders modals and slideovers with Vuetify's `v-dialog` and `v-card` instead of Tailwind CSS.

## Features

- ✅ **Drop-in replacement** - Same API as `@inertiaui/modal-vue`
- ✅ **Vuetify 4 styling** - `v-dialog`, `v-card` and your Vuetify theme, icons and locale
- ✅ **Zero backend configuration** - Works with existing Inertia.js routes
- ✅ **Modal and slideover support** - Centered dialogs and full-height side panels
- ✅ **Nested/stacked modals** - Covered modals are blurred and hidden from assistive technology
- ✅ **Local modals** - Modals that don't require a route
- ✅ **TypeScript** - Typed props, slots, events and exposed methods

## Installation

```bash
npm install @gigerit/inertia-modal-vuetify
# or
bun add @gigerit/inertia-modal-vuetify
```

### Requirements

This package requires these peer dependencies:

- `vue` ^3.5.0
- `vuetify` ^4.2.0
- `@inertiajs/vue3` ^3.0.0

`@inertiaui/modal-vue` is installed automatically as a runtime dependency. On the Laravel side, install the matching [`inertiaui/modal`](https://inertiaui.com/inertia-modal/docs) package.

The close button uses Vuetify's `$close` icon alias, so it follows whichever icon set you configured (Material Design Icons by default).

The package ships as ESM only and does not need a stylesheet import.

## Quick Start

### 1. Configure Inertia.js

Mount your app with `renderApp`:

```js
import { createInertiaApp } from "@inertiajs/vue3";
import { renderApp } from "@gigerit/inertia-modal-vuetify";
import { createApp } from "vue";
import { createVuetify } from "vuetify";

createInertiaApp({
  setup({ el, App, props, plugin }) {
    createApp({ render: renderApp(App, props) })
      .use(plugin)
      .use(createVuetify())
      .mount(el);
  },
});
```

### 2. Use the ModalLink component

Replace Inertia's `Link` component with `ModalLink` to open routes in a modal:

```vue
<script setup>
import { ModalLink } from "@gigerit/inertia-modal-vuetify";
import { VBtn } from "vuetify/components";
</script>

<template>
  <ModalLink href="/users/create">Create User</ModalLink>

  <!-- Render as a Vuetify button; extra attributes are passed to it -->
  <ModalLink href="/users/create" :as="VBtn" color="primary">Create User</ModalLink>
</template>
```

Use `:as="VBtn"` instead of nesting a `v-btn` inside `ModalLink`, which would put a button inside a link.

### 3. Wrap the page content with Modal

```vue
<script setup>
import { Modal } from "@gigerit/inertia-modal-vuetify";
</script>

<template>
  <Modal v-slot="{ close }">
    <h2 class="text-h6 mb-4">Create User</h2>
    <v-form>
      <!-- Form fields -->
    </v-form>
    <v-btn @click="close">Cancel</v-btn>
  </Modal>
</template>
```

`Modal` already renders a padded `v-card`, so put your content in it directly. If you prefer Vuetify's card sections (`v-card-title`, `v-card-text`, ...), set `:padding-classes="false"`.

That's it! No backend changes needed.

## Usage Examples

### Slideover

```vue
<ModalLink href="/settings" slideover>Settings</ModalLink>
<ModalLink href="/settings" slideover position="left">Settings</ModalLink>
```

### Size and position

```vue
<ModalLink href="/users/create" max-width="4xl">Create User</ModalLink>
<ModalLink href="/users/create" position="top">Create User</ModalLink>
```

### Local modal (no route required)

```vue
<script setup>
import { Modal, ModalLink } from "@gigerit/inertia-modal-vuetify";
</script>

<template>
  <ModalLink href="#confirm-action">Delete Item</ModalLink>

  <Modal name="confirm-action" v-slot="{ close }">
    <p>Are you sure you want to delete this item?</p>
    <div class="d-flex justify-end ga-2 mt-4">
      <v-btn variant="text" @click="close">Cancel</v-btn>
      <v-btn color="error" @click="deleteItem">Delete</v-btn>
    </div>
  </Modal>
</template>
```

Components rendered inside a modal can call `useModal()` to get the modal instance, including inside local modals.

### Closing after a form submission

```vue
<Modal v-slot="{ close }">
  <v-form @submit.prevent="form.post('/users', { onSuccess: () => close() })">
    <!-- ... -->
  </v-form>
</Modal>
```

### Programmatic usage

```js
import { visitModal } from "@gigerit/inertia-modal-vuetify";

visitModal("/users/create", {
  config: { maxWidth: "lg" },
  onClose: () => console.log("Modal closed"),
});
```

## Configuration

### Modal props

Both `Modal` and `ModalLink` accept these props:

| Prop                     | Type           | Default (modal / slideover) | Description                                                 |
| ------------------------ | -------------- | --------------------------- | ----------------------------------------------------------- |
| `close-button`           | Boolean        | `true`                      | Show the close button                                       |
| `close-explicitly`       | Boolean        | `false`                     | Only close via the close button or programmatically         |
| `close-on-click-outside` | Boolean        | `true`                      | Close when the backdrop is clicked                          |
| `max-width`              | String         | `'2xl'` / `'md'`            | Maximum width, see below                                    |
| `padding-classes`        | String/Boolean | `'pa-4 pa-sm-6'`            | Padding classes for the content; `false` removes padding    |
| `panel-classes`          | String/Boolean | `''`                        | Extra classes for the content                               |
| `position`               | String         | `'center'` / `'right'`      | `top`, `center`, `bottom` for modals; `left`, `right` for slideovers |
| `slideover`              | Boolean        | `false`                     | Render as a slideover instead of a modal                    |

`max-width` keeps upstream's Tailwind tokens and maps them to the same widths: `sm` 384px, `md` 448px, `lg` 512px, `xl` 576px, `2xl` 672px, `3xl` 768px, `4xl` 896px, `5xl` 1024px, `6xl` 1152px, `7xl` 1280px. Unknown values fall back to `2xl`.

### Default configuration

```js
import { putConfig } from "@gigerit/inertia-modal-vuetify";

putConfig({
  modal: {
    maxWidth: "lg",
    closeExplicitly: true,
  },
  slideover: {
    position: "left",
  },
});

putConfig("modal.closeButton", false);
```

Keys you leave out keep their defaults. `resetConfig()` restores them. Use the configuration functions from this package rather than `@inertiaui/modal-vue`, so the defaults stay Vuetify classes instead of upstream's Tailwind classes.

## API Reference

### `<Modal>`

**Events:** `@close`, `@focus`, `@blur`, `@success`, `@after-leave`, plus any event emitted from the modal (for example `@user-created`).

**Slot props and methods (via ref):** `close()`, `reload()`, `setOpen(open)`, `emit(event, ...args)`, `getParentModal()`, `getChildModal()`, `isOpen`, `onTopOfStack`, `config`, and the modal's page props.

### `<ModalLink>`

The upstream `ModalLink`. Besides the modal props it accepts `href`, `method`, `data`, `headers`, `as`, `navigate`, `prefetch` and `cache-for`, and emits `@start`, `@success`, `@error`, `@close`, `@after-leave`, `@prefetching` and `@prefetched`.

### Functions

- `useModal()` - The current modal instance
- `visitModal(url, options)` - Open a modal programmatically
- `putConfig(key, value)`, `getConfig(key)`, `resetConfig()` - Default configuration
- `getMaxWidth(token)`, `getDialogLocation(position)` - The width and location mapping this package uses

All other upstream exports (`Deferred`, `WhenVisible`, `HeadlessModal`, `useModalStack`, `prefetch`, ...) are re-exported unchanged.

## Styling

Modals use your Vuetify theme, so colors, elevation and typography follow it. Use `panel-classes` and `padding-classes` for Vuetify utility classes:

```vue
<Modal panel-classes="bg-surface-variant" padding-classes="pa-8">
  <!-- Content -->
</Modal>
```

For further customization, target the `im-` classes: `im-modal-dialog`, `im-modal-wrapper`, `im-modal-content`, `im-slideover-dialog`, `im-slideover-left`, `im-slideover-wrapper`, `im-slideover-content` and `im-close-button`. Dialogs are teleported, so use global (unscoped) selectors.

## Server-side rendering

Vuetify components import their own CSS, so let Vite bundle this package and Vuetify for the SSR build, and pass `ssr: true` to Vuetify:

```js
// vite.config.js
export default defineConfig({
  ssr: {
    noExternal: ["vuetify", "@gigerit/inertia-modal-vuetify"],
  },
});
```

```js
// ssr.js
createSSRApp({ render: renderApp(App, props) })
  .use(plugin)
  .use(createVuetify({ ssr: true }));
```

## Migration from @inertiaui/modal-vue

1. Replace the imports:

   ```js
   // Before
   import { Modal, ModalLink } from "@inertiaui/modal-vue";

   // After
   import { Modal, ModalLink } from "@gigerit/inertia-modal-vuetify";
   ```

2. Replace Tailwind classes in `padding-classes`, `panel-classes` and `putConfig` with Vuetify utility classes.

3. Ensure Vuetify is installed and configured.

## Development

```bash
bun install
bun run test           # Vitest suite
bun run build          # Library build in dist/
bun run dev            # Local-modal playground in example/ at http://localhost:3000
```

`demo-app/` is a Laravel 13 app for testing routed modals against the package source; see [AGENTS.md](AGENTS.md) for its commands.

## Contributing

Contributions are welcome! Use [Conventional Commits](https://www.conventionalcommits.org/) (`feat:`, `fix:`, ...); release-please derives versions and the changelog from them.

## License

MIT

## Related Packages

- [@inertiaui/modal-vue](https://github.com/inertiaui/modal) - The upstream Tailwind-styled package
- [Inertia.js](https://inertiajs.com/)
- [Vuetify](https://vuetifyjs.com/)
