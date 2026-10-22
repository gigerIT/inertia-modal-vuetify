# Installation

Install the InertiaUI Modal Laravel package, then this Vuetify frontend from npm. It replaces `@inertiaui/modal-vue` and keeps its API, so don't install both.

## Composer Installation

```bash
composer require inertiaui/modal
```

After installing the Composer package, install the Vuetify frontend from npm.

## NPM Installation

```bash
npm install @inertia-vuetify/modal
```

## Inertia.js Configuration

Inertia Modal requires a *root*-component to be mounted in your app. You can do this in the main `app.js` file where you initialize your Inertia app using the `createInertiaApp` function. You only need to change the render function to include the `renderApp` method and pass the `App` component and `props` object to it.

```js
import { createApp } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { renderApp } from '@inertia-vuetify/modal'
import { createVuetify } from 'vuetify'

createInertiaApp({
    setup({ el, App, props, plugin }) {
        createApp({ render: renderApp(App, props) })
            .use(plugin)
            .use(createVuetify())
            .mount(el)
    }
})
```

If you need more refined control over the mounting process, you should check out the [Custom App Mounting](/custom-app-mounting.md) documentation.

## Vuetify Configuration

The package renders with Vuetify components, so no Tailwind setup or stylesheet import is required. The close button uses Vuetify's `$close` icon alias and `$vuetify.close` locale message, so it follows your configured icon set and language.

For server-side rendering, let Vite bundle Vuetify and this package and pass `ssr: true` to Vuetify:

```js
// vite.config.js
export default defineConfig({
    ssr: {
        noExternal: ['vuetify', '@inertia-vuetify/modal'],
    },
})
```

```js
// ssr.js
createSSRApp({ render: renderApp(App, props) })
    .use(plugin)
    .use(createVuetify({ ssr: true }))
```
