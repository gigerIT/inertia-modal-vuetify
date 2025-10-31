// Re-export utilities and functions from @inertiaui/modal-vue
export {
    getConfig,
    putConfig,
    resetConfig,
    initFromPageProps,
    renderApp,
    useModal,
    useModalStack,
    visitModal,
    Deferred,
    HeadlessModal,
    ModalRoot,
    WhenVisible,
} from '@inertiaui/modal-vue'

// Export our Vuetify-styled components
export { default as Modal } from './Modal.vue'
export { default as ModalLink } from './ModalLink.vue'

// Export config helpers
export { getMaxWidth, getDialogLocation } from './config.js'

