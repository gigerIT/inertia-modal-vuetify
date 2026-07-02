# Installation

Install the Laravel backend package when your app uses the InertiaUI Modal server helpers, then install this Vuetify frontend adapter with npm. This adapter replaces the upstream Vue frontend package while keeping the same modal runtime API.

## Composer Installation

```bash
composer require inertiaui/modal
```

After installing the Composer package, install the Vuetify adapter from npm.

## NPM Installation

```bash
npm install @gigerit/inertia-modal-vuetify
```

## Inertia.js Configuration

Inertia Modal requires a *root*-component to be mounted in your app. You can do this in the main `app.js` file where you initialize your Inertia app using the `createInertiaApp` function. You only need to change the render function to include the `renderApp` method and pass the `App` component and `props` object to it.

```js
import { createApp } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { renderApp } from '@gigerit/inertia-modal-vuetify'

createInertiaApp({
    setup({ el, App, props, plugin }) {
        return createApp({ render: renderApp(App, props) })
            .use(plugin)
            .mount(el)
    }
})
```

If you need more refined control over the mounting process, you should check out the [Custom App Mounting](/custom-app-mounting.md) documentation.

## Vuetify Configuration

This adapter renders with Vuetify components, so no Tailwind content path is required. Make sure Vuetify and your icon font are installed and configured in your Vue app.
