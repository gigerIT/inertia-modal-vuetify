import type { ModalConfig, ModalInstance, ModalTypeConfig, ReloadOptions } from '@inertiaui/modal-vue'
import type { AllowedComponentProps, Component, ComponentCustomProps, VNode, VNodeProps } from 'vue'

export {
    getConfig,
    initFromPageProps,
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
    ModalLink,
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

export type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
export type ModalPosition = 'top' | 'center' | 'bottom'
export type SlideoverPosition = 'left' | 'right'

export interface ModalProps {
    name?: string
    slideover?: boolean
    closeButton?: boolean
    closeExplicitly?: boolean
    closeOnClickOutside?: boolean
    maxWidth?: MaxWidth
    paddingClasses?: string | boolean
    panelClasses?: string | boolean
    position?: ModalPosition | SlideoverPosition
}

export interface ModalSlotProps extends Record<string, unknown> {
    id: string
    index: number
    isOpen: boolean
    onTopOfStack: boolean
    shouldRender: boolean
    config: ModalConfig
    modalContext: ModalInstance
    afterLeave: () => void
    close: () => void
    emit: (event: string, ...args: unknown[]) => void
    getChildModal: () => ModalInstance | null
    getParentModal: () => ModalInstance | null | undefined
    reload: (options?: ReloadOptions) => void
    setOpen: (open: boolean) => void
}

export interface ModalExposed {
    afterLeave(): void
    close(): void
    emit(event: string, ...args: unknown[]): void
    getChildModal(): ModalInstance | null | undefined
    getParentModal(): ModalInstance | null | undefined
    reload(options?: ReloadOptions): void
    setOpen(open: boolean): void
    readonly config: ModalConfig | undefined
    readonly id: string | undefined
    readonly index: number | undefined
    readonly isOpen: boolean | undefined
    readonly modalContext: unknown
    readonly onTopOfStack: boolean | undefined
    readonly shouldRender: boolean | undefined
}

export interface ModalEvents {
    onAfterLeave?: () => void
    onBlur?: () => void
    onClose?: () => void
    onFocus?: () => void
    onSuccess?: () => void
    /** Listeners for events emitted from the modal, e.g. `@user-created`. */
    [event: `on${string}`]: ((...args: any[]) => void) | undefined
}

export declare const Modal: new () => ModalExposed & {
    $props: AllowedComponentProps & ComponentCustomProps & VNodeProps & ModalProps & ModalEvents
    $slots: {
        default?: (props: ModalSlotProps) => VNode[]
    }
}

export interface GlobalModalConfig {
    type?: 'modal' | 'slideover'
    navigate?: boolean
    appElement?: string | null
    modal?: Partial<ModalTypeConfig>
    slideover?: Partial<ModalTypeConfig>
}

/** Upstream still types `props` for Inertia 2, which rejects Inertia 3's setup props. */
export declare function renderApp(App: Component, props: object): () => VNode

export declare function putConfig(config: GlobalModalConfig): void
export declare function putConfig(key: string, value: unknown): void
export declare function resetConfig(): void
export declare function getMaxWidth(maxWidth?: string | null): string
export declare function getDialogLocation(position?: string | null): ModalPosition
