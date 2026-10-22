import { wayfinder } from '@laravel/vite-plugin-wayfinder';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import vuetify from 'vite-plugin-vuetify';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/js/app.ts'],
            ssr: 'resources/js/ssr.ts',
            refresh: true,
        }),
        vue({
            template: {
                transformAssetUrls: {
                    base: null,
                    includeAbsolute: false,
                },
            },
        }),
        wayfinder({
            formVariants: true,
        }),
        vuetify({ autoImport: true }),
    ],
    resolve: {
        alias: {
            '@gigerit/inertia-modal-vuetify': resolve(__dirname, '../src/index.js'),
        },
        // The aliased adapter source lives outside this app; resolve its imports here to avoid duplicate runtimes.
        dedupe: ['vue', 'vuetify', '@inertiajs/vue3', '@inertiaui/modal-vue', '@inertiaui/vanilla'],
    },
    ssr: {
        noExternal: ['vuetify'],
    },
});
