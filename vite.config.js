import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/index.js',
            formats: ['es'],
            fileName: 'inertia-modal-vuetify',
        },
        rolldownOptions: {
            // Bundling any of these would give the consumer a second Vue, Vuetify, Inertia, or modal stack instance.
            external: [/^vue($|\/)/, /^vuetify($|\/)/, /^@inertiajs\//, /^@inertiaui\//],
        },
    },
    test: {
        include: ['tests/**/*.test.js'],
        environment: 'happy-dom',
        setupFiles: ['tests/setup.js'],
        // Vuetify components import their CSS, which only Vite can load.
        server: { deps: { inline: ['vuetify'] } },
    },
})
