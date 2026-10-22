import type { HttpResponse, Method, RequestPayload } from '@inertiajs/core'
import type { UnwrapNestedRefs } from 'vue'
import type { ModalInstance } from './modalStack'

export type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl'
export type ModalPosition = 'top' | 'center' | 'bottom'
export type SlideoverPosition = 'left' | 'right' | 'bottom'
export type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | 'xxl'
export type HttpMethod = Method

/**
 * `true`/`false`, `'mobile'` for Vuetify's `display.mobile`, or fullscreen
 * below a Vuetify breakpoint or pixel width.
 */
export type Fullscreen = boolean | 'mobile' | Breakpoint | number

/** Runs before a user-initiated close; return `false` to keep the modal open. */
export type BeforeClose = () => boolean | void | Promise<boolean | void>

export interface ModalTypeConfig {
    closeButton: boolean
    closeExplicitly: boolean
    closeOnClickOutside: boolean
    maxWidth: MaxWidth | (string & {})
    paddingClasses: string | false
    panelClasses: string | false
    position: ModalPosition | SlideoverPosition
    fullscreen: Fullscreen
}

/** The configuration of a single modal, as resolved from its props, the visit, and the defaults. */
export type ModalConfig = Partial<ModalTypeConfig & { slideover: boolean }>

/** What `putConfig()` accepts; omitted keys get their defaults. */
export interface GlobalModalConfig {
    type?: 'modal' | 'slideover'
    navigate?: boolean
    appElement?: string | null
    modal?: Partial<ModalTypeConfig>
    slideover?: Partial<ModalTypeConfig>
}

/** The `_inertiaui_modal` payload the `inertiaui/modal` Laravel package sends. */
export interface ModalResponseData {
    id?: string
    component: string
    props: Record<string, unknown>
    url?: string
    version?: string
    meta?: {
        deferredProps?: Record<string, string[]>
    }
    baseUrl?: string
}

export interface ReloadOptions {
    only?: string[]
    except?: string[]
    method?: HttpMethod
    data?: Record<string, unknown>
    headers?: Record<string, string>
    onStart?: () => void
    onSuccess?: (response: HttpResponse) => void
    onError?: (error: unknown) => void
    onFinish?: () => void
}

export interface VisitOptions {
    method?: HttpMethod
    data?: RequestPayload
    headers?: Record<string, string>
    config?: ModalConfig
    onClose?: () => void
    onAfterLeave?: () => void
    queryStringArrayFormat?: 'brackets' | 'indices'
    navigate?: boolean
    onStart?: () => void
    onSuccess?: (response?: HttpResponse) => void
    onError?: (...args: unknown[]) => void
    listeners?: Record<string, (...args: unknown[]) => void>
    /** Props for local modals. */
    props?: Record<string, unknown>
}

export type PrefetchOption = boolean | 'hover' | 'click' | 'mount' | Array<'hover' | 'click' | 'mount'>

export interface PrefetchOptions {
    method?: HttpMethod
    data?: RequestPayload
    headers?: Record<string, string>
    queryStringArrayFormat?: 'brackets' | 'indices'
    cacheFor?: number
    onPrefetching?: () => void
    onPrefetched?: () => void
}

/** A modal instance as components see it, with its computed refs unwrapped. */
export type ModalContext = UnwrapNestedRefs<ModalInstance>

export interface HeadlessModalSlotProps extends Record<string, unknown> {
    id: string
    index: number
    isOpen: boolean
    onTopOfStack: boolean
    shouldRender: boolean
    config: ModalConfig
    modalContext: ModalContext
    afterLeave: () => void
    /** Closes immediately, skipping `before-close`. */
    close: () => void
    emit: (event: string, ...args: unknown[]) => void
    getChildModal: () => ModalContext | null
    getParentModal: () => ModalContext | null
    reload: (options?: ReloadOptions) => Promise<void>
    setOpen: (open: boolean) => void
}

export interface ModalSlotProps extends HeadlessModalSlotProps {
    /** Closes like the close button does, so `before-close` can veto it. */
    requestClose: () => Promise<void>
}
