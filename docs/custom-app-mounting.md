# Custom App Mounting

If you need more refined control over the mounting process, contrary to the regular [Inertia.js installation](/installation#inertia-js-configuration), you may skip the `renderApp` helper and wrap the `App` component in the `ModalRoot` component yourself:

```js
import { createInertiaApp } from '@inertiajs/vue3'
import { ModalRoot } from '@inertia-vuetify/modal'
import { createApp, h } from 'vue'
import { createVuetify } from 'vuetify'

createInertiaApp({
    setup({ el, App, props, plugin }) {
        createApp({ render: () => h(ModalRoot, () => h(App, props)) }) // [!code ++]
            .use(plugin)
            .use(createVuetify())
            .mount(el)
    }
})
```

If you already created the app with its own render function, `withInertiaModal(app)` wraps that render function in `ModalRoot` for you.
