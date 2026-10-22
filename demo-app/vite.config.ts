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
            '@inertia-vuetify/modal': resolve(__dirname, '../src/index.ts'),
        },
        // The aliased adapter source lives outside this app; resolve its imports here to avoid duplicate runtimes.
        dedupe: ['vue', 'vuetify', '@inertiajs/core', '@inertiajs/vue3', '@inertiaui/vanilla'],
    },
    ssr: {
        noExternal: ['vuetify'],
    },
});
