import type { DefineComponent } from 'vue'

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
