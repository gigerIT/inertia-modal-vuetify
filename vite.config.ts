import vue from '@vitejs/plugin-vue'
import { playwright } from '@vitest/browser-playwright'
import { defineConfig } from 'vitest/config'

export default defineConfig({
    plugins: [vue()],
    build: {
        lib: {
            entry: 'src/index.ts',
            formats: ['es'],
            fileName: 'inertia-modal-vuetify',
        },
        rolldownOptions: {
            // Bundling any of these would give the consumer a second Vue, Vuetify, Inertia, or modal stack instance.
            external: [/^vue($|\/)/, /^vuetify($|\/)/, /^@inertiajs\//, /^@inertiaui\//],
        },
    },
    test: {
        projects: [
            {
                extends: true,
                test: { name: 'unit', include: ['tests/unit/**/*.test.ts'], environment: 'node' },
            },
            {
                extends: true,
                test: {
                    name: 'browser',
                    include: ['tests/browser/**/*.test.ts'],
                    browser: {
                        enabled: true,
                        headless: true,
                        provider: playwright(),
                        instances: [{ browser: 'chromium' }],
                    },
                },
            },
        ],
    },
})
