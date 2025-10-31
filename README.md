# @gigerit/inertia-modal-vuetify

A Vuetify-styled drop-in replacement for [@inertiaui/modal-vue](https://github.com/inertiaui/modal). This package provides the same functionality as the original package but uses Vuetify components (`v-dialog`, `v-card`, `v-btn`) instead of Tailwind CSS for styling.

## Features

- ✅ **Drop-in replacement** - Same API as `@inertiaui/modal-vue`
- ✅ **Vuetify 3 styling** - Uses `v-dialog`, `v-card`, and other Vuetify components
- ✅ **Zero backend configuration** - Works with existing Inertia.js routes
- ✅ **Modal and slideover support** - Both dialog and drawer-style modals
- ✅ **Nested/stacked modals** - Support for multiple modals
- ✅ **Local modals** - Modals that don't require a route
- ✅ **Highly configurable** - Customizable sizes, positions, and behavior
- ✅ **Full feature parity** - All features from the original package

## Installation

```bash
npm install @gigerit/inertia-modal-vuetify
# or
yarn add @gigerit/inertia-modal-vuetify
# or
pnpm add @gigerit/inertia-modal-vuetify
# or
bun add @gigerit/inertia-modal-vuetify
```

### Peer Dependencies

This package requires the following peer dependencies:

- `vue` ^3.0.0
- `vuetify` ^3.0.0
- `@inertiajs/vue3` ^2.0.0
- `@inertiaui/modal-vue` (automatically installed as a dependency)

Make sure you have Vuetify installed and configured in your project:

```bash
npm install vuetify @mdi/font
```

## Quick Start

### 1. Configure Inertia.js

Update your `app.js` (or `main.js`) to use the `renderApp` function:

```js
import { createApp } from "vue";
import { createInertiaApp } from "@inertiajs/vue3";
import { renderApp } from "@gigerit/inertia-modal-vuetify"; // [!code ++]

createInertiaApp({
  setup({ el, App, props, plugin }) {
    return createApp({ render: renderApp(App, props) }) // [!code ++]
      .use(plugin)
      .mount(el);
  },
});
```

### 2. Use ModalLink Component

Replace Inertia's `Link` component with `ModalLink` to open routes in a modal:

```vue
<script setup>
import { ModalLink } from "@gigerit/inertia-modal-vuetify";
</script>

<template>
  <ModalLink href="/users/create"> Create User </ModalLink>
</template>
```

### 3. Wrap Content with Modal Component

In your modal route/page, wrap the content with the `Modal` component:

```vue
<script setup>
import { Modal } from "@gigerit/inertia-modal-vuetify";
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

That's it! No backend changes needed.

## Usage Examples

### Basic Modal

```vue
<template>
  <Modal>
    <v-card>
      <v-card-title>Modal Title</v-card-title>
      <v-card-text> Modal content goes here </v-card-text>
    </v-card>
  </Modal>
</template>
```

### Slideover (Drawer)

```vue
<template>
  <ModalLink href="/settings" slideover> Open Settings </ModalLink>
</template>

<!-- In your settings page -->
<template>
  <Modal slideover>
    <v-card class="h-100">
      <v-card-title>Settings</v-card-title>
      <v-card-text> Settings content </v-card-text>
    </v-card>
  </Modal>
</template>
```

### Custom Size

```vue
<template>
  <ModalLink href="/users/create" max-width="4xl"> Create User </ModalLink>
</template>
```

### Local Modal (No Route Required)

```vue
<template>
  <div>
    <ModalLink href="#confirm-action"> Delete Item </ModalLink>

    <Modal name="confirm-action">
      <v-card>
        <v-card-title>Confirm Action</v-card-title>
        <v-card-text> Are you sure you want to delete this item? </v-card-text>
        <v-card-actions>
          <v-btn @click="modal.close()">Cancel</v-btn>
          <v-btn color="error" @click="deleteItem">Delete</v-btn>
        </v-card-actions>
      </v-card>
    </Modal>
  </div>
</template>

<script setup>
import { Modal, ModalLink, useModal } from "@gigerit/inertia-modal-vuetify";

const modal = useModal();
</script>
```

### Programmatic Usage

```vue
<script setup>
import { visitModal } from "@gigerit/inertia-modal-vuetify";

function openModal() {
  visitModal("/users/create", {
    config: {
      maxWidth: "lg",
      closeButton: true,
    },
    onClose: () => {
      console.log("Modal closed");
    },
  });
}
</script>

<template>
  <v-btn @click="openModal">Open Modal</v-btn>
</template>
```

## Configuration

### Modal Props

Both `Modal` and `ModalLink` components accept the following props:

| Prop               | Type           | Default          | Description                                                                      |
| ------------------ | -------------- | ---------------- | -------------------------------------------------------------------------------- |
| `close-button`     | Boolean        | `true`           | Show/hide the close button                                                       |
| `close-explicitly` | Boolean        | `false`          | Only close via button or programmatically                                        |
| `max-width`        | String         | `'2xl'`          | Maximum width (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`, `4xl`, `5xl`, `6xl`, `7xl`) |
| `padding-classes`  | String/Boolean | `'pa-4 pa-sm-6'` | Vuetify padding classes                                                          |
| `panel-classes`    | String/Boolean | `''`             | Additional classes for the panel                                                 |
| `position`         | String         | `'center'`       | Position (`top`, `center`, `bottom` for modals; `left`, `right` for slideovers)  |
| `slideover`        | Boolean        | `false`          | Render as slideover instead of modal                                             |

### Default Configuration

You can set default configuration for all modals:

```js
import { putConfig } from "@gigerit/inertia-modal-vuetify";

putConfig({
  modal: {
    closeButton: true,
    closeExplicitly: false,
    maxWidth: "2xl",
    paddingClasses: "pa-4 pa-sm-6",
    panelClasses: "",
    position: "center",
  },
  slideover: {
    closeButton: true,
    closeExplicitly: false,
    maxWidth: "md",
    paddingClasses: "pa-4 pa-sm-6",
    panelClasses: "",
    position: "right",
  },
});
```

Or update individual settings:

```js
putConfig("modal.maxWidth", "lg");
putConfig("modal.closeButton", false);
```

## API Reference

### Components

#### `<Modal>`

The main modal component that wraps your content.

**Props:** See [Configuration](#configuration) section above.

**Events:**

- `@close` - Emitted when modal is closed
- `@focus` - Emitted when modal gains focus
- `@blur` - Emitted when modal loses focus
- `@success` - Emitted when modal is successfully opened
- `@after-leave` - Emitted after modal is removed from DOM

**Methods (via ref):**

- `close()` - Close the modal
- `reload()` - Reload modal props
- `setOpen(boolean)` - Set open state

#### `<ModalLink>`

A link component that opens routes in a modal.

**Props:**

- `href` (String, required) - The route to open
- `method` (String) - HTTP method (default: `'get'`)
- `data` (Object) - Data to send with request
- `headers` (Object) - Additional headers
- All modal configuration props

**Events:**

- `@start` - Emitted when request starts
- `@success` - Emitted when modal opens successfully
- `@error` - Emitted on error
- `@close` - Emitted when modal closes
- `@after-leave` - Emitted after modal is removed

### Composable Functions

#### `useModal()`

Access modal context and methods in child components:

```vue
<script setup>
import { useModal } from "@gigerit/inertia-modal-vuetify";

const { close, reload, props, config } = useModal();
</script>
```

#### `visitModal(url, options)`

Programmatically open a modal:

```js
import { visitModal } from "@gigerit/inertia-modal-vuetify";

visitModal("/users/create", {
  method: "post",
  data: { name: "John" },
  config: {
    maxWidth: "lg",
  },
  onClose: () => console.log("Closed"),
});
```

### Configuration Functions

- `getConfig(key)` - Get configuration value
- `putConfig(key, value)` - Set configuration value
- `resetConfig()` - Reset to defaults

## Styling

This package uses Vuetify components, so all styling is handled through Vuetify's theming system. You can customize:

- **Colors** - Use Vuetify theme colors
- **Spacing** - Use Vuetify spacing utilities (`pa-4`, `ma-2`, etc.)
- **Elevation** - Cards use Vuetify's elevation system
- **Typography** - Inherits from your Vuetify theme

### Custom Classes

You can still apply custom classes via the `panel-classes` and `padding-classes` props:

```vue
<Modal panel-classes="bg-blue-grey-darken-1" padding-classes="pa-8">
    <!-- Content -->
</Modal>
```

## Migration from @inertiaui/modal-vue

This package is designed as a drop-in replacement. Simply:

1. Replace the import:

   ```js
   // Before
   import { Modal, ModalLink } from "@inertiaui/modal-vue";

   // After
   import { Modal, ModalLink } from "@gigerit/inertia-modal-vuetify";
   ```

2. Remove Tailwind CSS configuration (if not used elsewhere)

3. Ensure Vuetify is installed and configured

That's it! The API is identical, so no code changes are needed.

## Example App

An example application is included in the `example/` directory. To run it:

```bash
# Install dependencies
bun install

# Run the example
bun run dev
```

Visit `http://localhost:3000` to see various modal examples in action.

## Differences from @inertiaui/modal-vue

The main differences are:

1. **Styling** - Uses Vuetify components instead of Tailwind CSS
2. **No Tailwind required** - Pure Vuetify styling
3. **Vuetify theming** - Respects your Vuetify theme configuration
4. **Material Design Icons** - Close button uses `mdi-close` icon

All functionality, API, and behavior remain the same.

## Browser Support

Supports all browsers that Vuetify 3 supports. See [Vuetify Browser Support](https://vuetifyjs.com/en/getting-started/browser-support/).

## Building

To build the package locally:

```bash
npm run build
```

This will create the `dist/` directory with:

- `inertia-modal-vuetify.es.js` - ES module build
- `inertia-modal-vuetify.cjs.js` - CommonJS build
- `index.d.ts` - TypeScript definitions

The package is automatically built before publishing via the `prepublishOnly` script.

## Development

To run the example app:

```bash
npm run dev
```

This starts the Vite dev server for the example application.

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit using conventional commits (e.g., `feat: add new feature`)
5. Push to your branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Commit Message Format

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated versioning:

- `feat:` - New feature (minor version bump)
- `fix:` - Bug fix (patch version bump)
- `feat!:` or `BREAKING CHANGE:` - Breaking change (major version bump)
- `docs:` - Documentation changes
- `style:` - Code style changes
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding tests
- `chore:` - Maintenance tasks

## License

MIT

## Related Packages

- [@inertiaui/modal-vue](https://github.com/inertiaui/modal) - Original Tailwind-styled version
- [Inertia.js](https://inertiajs.com/) - The underlying framework
- [Vuetify](https://vuetifyjs.com/) - The UI framework used for styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues related to:

- **Modal functionality** - See [@inertiaui/modal-vue documentation](https://inertiaui.com/modal)
- **Vuetify styling** - See [Vuetify documentation](https://vuetifyjs.com/)
- **This package** - Open an issue on GitHub
