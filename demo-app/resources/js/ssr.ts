import { renderApp } from '@gigerit/inertia-modal-vuetify';
import { createInertiaApp } from '@inertiajs/vue3';
import createServer from '@inertiajs/vue3/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createSSRApp, DefineComponent } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { createVuetify } from 'vuetify';

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createServer(
    (page) =>
        createInertiaApp({
            page,
            render: renderToString,
            title: (title) => (title ? `${title} - ${appName}` : appName),
            resolve: (name) => resolvePageComponent(`./pages/${name}.vue`, import.meta.glob<DefineComponent>('./pages/**/*.vue')),
            setup: ({ App, props, plugin }) =>
                createSSRApp({ render: renderApp(App, props) })
                    .use(plugin)
                    .use(createVuetify({ ssr: true })),
        }),
    { cluster: true },
);
