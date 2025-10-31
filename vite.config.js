import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: resolve(__dirname, 'src/index.js'),
            name: 'InertiaModalVuetify',
            fileName: (format) => `inertia-modal-vuetify.${format}.js`,
            formats: ['es', 'cjs'],
        },
        rollupOptions: {
            external: [
                'vue',
                'vuetify',
                '@inertiajs/vue3',
                '@inertiaui/modal-vue',
            ],
            output: {
                globals: {
                    vue: 'Vue',
                    vuetify: 'Vuetify',
                    '@inertiajs/vue3': 'InertiaVue3',
                    '@inertiaui/modal-vue': 'InertiaUIModalVue',
                },
            },
        },
        outDir: 'dist',
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
        },
    },
})

