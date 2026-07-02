import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

const declaration = `import type { DefineComponent } from 'vue'

export {
    getConfig,
    putConfig,
    resetConfig,
    initFromPageProps,
    renderApp,
    withInertiaModal,
    useModal,
    useModalStack,
    visitModal,
    prefetch,
    modalPropNames,
    ModalInstance,
    dialogUtils,
    Deferred,
    HeadlessModal,
    ModalRoot,
    WhenVisible,
} from '@inertiaui/modal-vue'

export type {
    ModalStack,
    ModalResponseData,
    ModalConfig,
    ReloadOptions,
    VisitOptions,
    HttpMethod,
    PrefetchOption,
    PrefetchOptions,
    ModalTypeConfig,
    CleanupFunction,
    FocusTrapOptions,
    EscapeKeyOptions,
} from '@inertiaui/modal-vue'

export const Modal: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
export const ModalLink: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>

export function getMaxWidth(maxWidth?: string | null): string
export function getDialogLocation(position?: string | null): string
`

function emitTypes() {
    return {
        name: 'emit-types',
        generateBundle() {
            this.emitFile({
                type: 'asset',
                fileName: 'index.d.ts',
                source: declaration,
            })
        },
    }
}

export default defineConfig({
    plugins: [vue(), emitTypes()],
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
                'vuetify/components',
                '@inertiajs/vue3',
                '@inertiaui/modal-vue',
                '@inertiaui/vanilla',
            ],
            output: {
                globals: {
                    vue: 'Vue',
                    vuetify: 'Vuetify',
                    'vuetify/components': 'VuetifyComponents',
                    '@inertiajs/vue3': 'InertiaVue3',
                    '@inertiaui/modal-vue': 'InertiaUIModalVue',
                    '@inertiaui/vanilla': 'InertiaUIVanilla',
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
