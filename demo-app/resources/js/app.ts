import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';

import { renderApp } from '@gigerit/inertia-modal-vuetify';
import { createInertiaApp } from '@inertiajs/vue3';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import type { DefineComponent } from 'vue';
import { createApp } from 'vue';
import { createVuetify } from 'vuetify';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
    setup({ el, App, props, plugin }) {
        createApp({ render: renderApp(App, props) })
            .use(plugin)
            .use(createVuetify())
            .mount(el);
    },
    progress: {
        color: '#4B5563',
    },
});
