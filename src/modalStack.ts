import { mergeDataIntoQueryString, type HttpResponse, type RequestPayload } from '@inertiajs/core'
import { http, progress, router, usePage } from '@inertiajs/vue3'
import { computed, markRaw, nextTick, reactive, readonly, ref, type Component, type ComputedRef, type Ref } from 'vue'
import { ResponseCache } from './cache'
import { getConfig } from './config'
import { except, generateId, kebabCase, parseResponseData, sameUrlPath } from './helpers'
import type { HttpMethod, ModalConfig, ModalContext, ModalResponseData, PrefetchOptions, ReloadOptions, VisitOptions } from './types'

type EventCallback = (...args: unknown[]) => void
type ComponentResolver = (name: string) => Promise<Component>

const baseUrl = ref<string | null>(null)
const stack = ref<ModalInstance[]>([])
const localModals = ref<Record<string, { name: string; callback: (modal: ModalInstance) => void }>>({})

// The URL the stack is closing to, so the navigate handler doesn't re-set the base URL for it.
let closingToBaseUrlTarget: string | null = null

const prefetchCache = new ResponseCache<HttpResponse>()

function requestHeaders(headers: Record<string, string>, modalId = generateId()): Record<string, string> {
    return {
        ...headers,
        Accept: 'text/html, application/xhtml+xml',
        'X-Requested-With': 'XMLHttpRequest',
        'X-Inertia': 'true',
        'X-Inertia-Version': usePage().version ?? '',
        'X-InertiaUI-Modal': modalId,
        'X-InertiaUI-Modal-Base-Url': baseUrl.value ?? '',
    }
}

export function prefetch(href: string, options: PrefetchOptions = {}): Promise<void> {
    if (href.startsWith('#')) {
        return Promise.resolve()
    }

    const method = options.method ?? 'get'
    const [url, data] = mergeDataIntoQueryString(method, href, options.data ?? {}, options.queryStringArrayFormat ?? 'brackets')
    const cacheKey = ResponseCache.key(method, url, data)

    if (prefetchCache.get(cacheKey)) {
        return Promise.resolve()
    }

    const inFlight = prefetchCache.getInFlight(cacheKey)

    if (inFlight) {
        return inFlight.then(() => {})
    }

    options.onPrefetching?.()

    const request = http
        .getClient()
        .request({ url, method, data, headers: requestHeaders(options.headers ?? {}) })
        .then((response) => {
            prefetchCache.set(cacheKey, response, options.cacheFor ?? 30000)
            options.onPrefetched?.()
            return response
        })
        .finally(() => prefetchCache.deleteInFlight(cacheKey))

    prefetchCache.setInFlight(cacheKey, request)

    return request.then(() => {})
}

/** @deprecated A no-op kept for setup code written for Inertia 2. */
export const initFromPageProps = (_pageProps: Record<string, unknown>): void => {}

export class ModalInstance {
    id: string
    isOpen = false
    shouldRender = false
    listeners: Record<string, EventCallback[]> = {}
    component: Component | null
    props: Ref<Record<string, unknown>>
    response: ModalResponseData
    config: ModalConfig
    onCloseCallback: (() => void) | null
    afterLeaveCallback: (() => void) | null
    index: ComputedRef<number>
    onTopOfStack: ComputedRef<boolean>
    name?: string

    constructor(
        component: Component | null,
        response: ModalResponseData,
        config?: ModalConfig | null,
        onClose?: (() => void) | null,
        afterLeave?: (() => void) | null,
    ) {
        this.id = response.id ?? generateId()
        this.component = component
        this.props = ref(response.props ?? {})
        this.response = response
        this.config = config ?? {}
        this.onCloseCallback = onClose ?? null
        this.afterLeaveCallback = afterLeave ?? null

        this.index = computed(() => stack.value.findIndex((modal) => modal.id === this.id))
        this.onTopOfStack = computed(() => {
            if (stack.value.length < 2) {
                return true
            }

            return stack.value.findLast((modal) => modal.shouldRender)?.id === this.id
        })
    }

    // Methods are arrow functions because templates pass them around detached from the instance.

    getComponentPropKeys = (): string[] => {
        const componentProps = (this.component as { props?: string[] | Record<string, unknown> } | null)?.props

        if (Array.isArray(componentProps)) {
            return componentProps
        }

        return componentProps ? Object.keys(componentProps) : []
    }

    getParentModal = (): ModalContext | null => {
        const index = this.index.value

        return index < 1 ? null : (stack.value.slice(0, index).findLast((modal) => modal.isOpen) ?? null)
    }

    getChildModal = (): ModalContext | null => {
        const index = this.index.value

        return index === stack.value.length - 1 ? null : (stack.value.slice(index + 1).find((modal) => modal.isOpen) ?? null)
    }

    // State is written through the stack's reactive proxy so components re-render.

    show = (): void => {
        const modal = stack.value[this.index.value]

        if (modal && !modal.isOpen) {
            modal.isOpen = true
            modal.shouldRender = true
        }
    }

    close = (): void => {
        const modal = stack.value[this.index.value]

        if (!modal?.isOpen) {
            return
        }

        Object.keys(this.listeners).forEach((event) => this.off(event))

        modal.isOpen = false
        this.onCloseCallback?.()
        this.onCloseCallback = null
    }

    setOpen = (open: boolean): void => {
        if (open) {
            this.show()
        } else {
            this.close()
        }
    }

    afterLeave = (): void => {
        const index = this.index.value
        const modal = stack.value[index]

        if (modal) {
            if (modal.isOpen) {
                return
            }

            modal.shouldRender = false
            this.afterLeaveCallback?.()
            this.afterLeaveCallback = null
        }

        if (index !== 0) {
            return
        }

        stack.value = []

        // Clear the base URL before router.push() so its navigate event doesn't set it again.
        const savedBaseUrl = baseUrl.value
        baseUrl.value = null
        closingToBaseUrlTarget = savedBaseUrl

        // Only navigate mode changes the URL; pushing the same URL would re-render the whole page.
        if (savedBaseUrl && typeof window !== 'undefined' && !sameUrlPath(savedBaseUrl, window.location.href)) {
            router.push({
                url: savedBaseUrl,
                preserveScroll: true,
                preserveState: true,
                // Props are merged, so the modal data has to be cleared explicitly or the modal reopens.
                props: (currentProps: Record<string, unknown>) => ({ ...currentProps, _inertiaui_modal: undefined }),
            })
        }
    }

    on = (event: string, callback: EventCallback): void => {
        event = kebabCase(event)
        this.listeners[event] = this.listeners[event] ?? []
        this.listeners[event].push(callback)
    }

    off = (event: string, callback?: EventCallback): void => {
        event = kebabCase(event)

        if (callback) {
            this.listeners[event] = this.listeners[event]?.filter((listener) => listener !== callback) ?? []
        } else {
            delete this.listeners[event]
        }
    }

    emit = (event: string, ...args: unknown[]): void => {
        this.listeners[kebabCase(event)]?.forEach((callback) => callback(...args))
    }

    registerEventListenersFromAttrs = (attrs: Record<string, unknown>): (() => void) => {
        const unsubscribers = Object.keys(attrs)
            .filter((key) => key.startsWith('on'))
            .map((key) => {
                const event = kebabCase(key).replace(/^on-/, '')
                const callback = attrs[key] as EventCallback
                this.on(event, callback)
                return () => this.off(event, callback)
            })

        return () => unsubscribers.forEach((unsubscribe) => unsubscribe())
    }

    reload = async (options: ReloadOptions = {}): Promise<void> => {
        if (!this.response.url) {
            return
        }

        const keys = except(options.only ?? Object.keys(this.response.props), options.except ?? [])
        const method = options.method ?? 'get'
        const data = options.data ?? {}

        options.onStart?.()

        try {
            const response = await http.getClient().request({
                url: this.response.url,
                method,
                data: method === 'get' ? undefined : data,
                params: method === 'get' ? data : undefined,
                headers: {
                    ...options.headers,
                    Accept: 'text/html, application/xhtml+xml',
                    'X-Inertia': 'true',
                    'X-Inertia-Partial-Component': this.response.component,
                    'X-Inertia-Version': this.response.version ?? '',
                    'X-Inertia-Partial-Data': keys.join(','),
                    'X-InertiaUI-Modal': generateId(),
                    'X-InertiaUI-Modal-Base-Url': baseUrl.value ?? '',
                },
            })

            this.updateProps((parseResponseData(response.data) as ModalResponseData).props)
            options.onSuccess?.(response)
        } catch (error) {
            options.onError?.(error)
        } finally {
            options.onFinish?.()
        }
    }

    updateProps = (props: Record<string, unknown>): void => {
        Object.assign(this.props.value, props)
    }
}

function registerLocalModal(name: string, callback: (modal: ModalInstance) => void): void {
    localModals.value[name] = { name, callback }
}

function pushLocalModal(
    name: string,
    config?: ModalConfig | null,
    onClose?: (() => void) | null,
    afterLeave?: (() => void) | null,
    props?: Record<string, unknown> | null,
): ModalInstance {
    const localModal = localModals.value[name]

    if (!localModal) {
        throw new Error(`The local modal "${name}" has not been registered.`)
    }

    const modal = push(null, { props: props ?? {} } as ModalResponseData, config, onClose, afterLeave)
    modal.name = name
    localModal.callback(modal)

    return modal
}

/** Removes a modal without waiting for its leave transition. */
export function discardModal(modal: ModalContext): void {
    modal.close()
    stack.value = stack.value.filter((entry) => entry.id !== modal.id)
    modal.afterLeaveCallback?.()
    modal.afterLeaveCallback = null
}

function isValidModalResponse(data: unknown): data is ModalResponseData {
    return typeof data === 'object' && data !== null && typeof (data as ModalResponseData).component === 'string'
}

function updateBrowserUrl(url: string | undefined, useBrowserHistory: boolean, modalData: ModalResponseData): void {
    if (!url || !useBrowserHistory || typeof window === 'undefined') {
        return
    }

    router.push({
        url,
        preserveScroll: true,
        preserveState: true,
        // Keep the modal in the history entry so back and forward can restore it.
        props: (currentProps: Record<string, unknown>) => ({
            ...currentProps,
            _inertiaui_modal: { ...modalData, baseUrl: baseUrl.value },
        }),
    })
}

function pushFromResponseData(
    responseData: ModalResponseData,
    config: ModalConfig = {},
    onClose: (() => void) | null = null,
    onAfterLeave: (() => void) | null = null,
): Promise<ModalInstance> {
    if (!isValidModalResponse(responseData)) {
        return Promise.reject(
            new Error(
                'Invalid modal response. This usually happens when the server returns a redirect (e.g., due to session expiration). ' +
                    'Check if the user is still authenticated.',
            ),
        )
    }

    return router
        .resolveComponent(responseData.component)
        .then((component) => push(markRaw(component as Component), responseData, config, onClose, onAfterLeave))
}

// Inertia's progress bar only exists when the app enabled it; otherwise its methods throw.
function toggleProgress(start: boolean): void {
    try {
        if (start) {
            progress.start()
        } else {
            progress.finish()
        }
    } catch {
        // Progress bar disabled.
    }
}

// Async so that every failure, including a missing local modal, rejects instead of throwing.
async function visit(
    href: string,
    method: HttpMethod,
    payload: RequestPayload = {},
    headers: Record<string, string> = {},
    config: ModalConfig = {},
    onClose: (() => void) | null = null,
    onAfterLeave: (() => void) | null = null,
    queryStringArrayFormat: 'brackets' | 'indices' = 'brackets',
    useBrowserHistory = false,
    onStart: (() => void) | null = null,
    onSuccess: ((response?: HttpResponse) => void) | null = null,
    onError: ((...args: unknown[]) => void) | null = null,
    props: Record<string, unknown> | null = null,
): Promise<ModalInstance> {
    if (href.startsWith('#')) {
        return pushLocalModal(href.substring(1), config, onClose, onAfterLeave, props)
    }

    const [url, data] = mergeDataIntoQueryString(method, href, payload, queryStringArrayFormat)

    const open = (response: HttpResponse) => {
        const responseData = parseResponseData(response.data) as ModalResponseData
        onSuccess?.(response)

        return pushFromResponseData(responseData, config, onClose, onAfterLeave).then((modal) => {
            updateBrowserUrl(responseData.url, useBrowserHistory, responseData)
            return modal
        })
    }

    // Set before using a prefetched response too, or closing in navigate mode can't restore the URL.
    if (stack.value.length === 0) {
        baseUrl.value = typeof window !== 'undefined' ? window.location.href : ''
    }

    const cachedResponse = prefetchCache.get(ResponseCache.key(method, url, data))

    if (cachedResponse) {
        return open(cachedResponse)
    }

    onStart?.()
    toggleProgress(true)

    return http
        .getClient()
        .request({ url, method, data, headers: requestHeaders(headers) })
        .then(open, (error: unknown) => {
            onError?.(error)
            throw error
        })
        .finally(() => toggleProgress(false))
}

/** Opens a modal for a URL, or a local modal for `#name`. */
export function visitModal(url: string, options: VisitOptions = {}): Promise<ModalInstance> {
    return visit(
        url,
        options.method ?? 'get',
        options.data ?? {},
        options.headers ?? {},
        options.config ?? {},
        options.onClose,
        options.onAfterLeave,
        options.queryStringArrayFormat ?? 'brackets',
        options.navigate ?? (getConfig('navigate') as boolean),
        options.onStart,
        options.onSuccess,
        options.onError,
        options.props ?? null,
    ).then((modal) => {
        Object.entries(options.listeners ?? {}).forEach(([event, callback]) => modal.on(kebabCase(event), callback))
        return modal
    })
}

function loadDeferredProps(modal: ModalInstance): void {
    Object.values(modal.response.meta?.deferredProps ?? {}).forEach((only) => modal.reload({ only }))
}

function push(
    component: Component | null,
    response: ModalResponseData,
    config?: ModalConfig | null,
    onClose?: (() => void) | null,
    afterLeave?: (() => void) | null,
): ModalInstance {
    const modal = new ModalInstance(component, response, config, onClose, afterLeave)
    stack.value.push(reactive(modal))
    loadDeferredProps(modal)

    nextTick(() => modal.show())

    return modal
}

export const modalPropNames = [
    'closeButton',
    'closeExplicitly',
    'closeOnClickOutside',
    'maxWidth',
    'paddingClasses',
    'panelClasses',
    'position',
    'slideover',
    'fullscreen',
]

export interface ModalStack {
    /** @deprecated A no-op kept for setup code written for Inertia 2. */
    setComponentResolver: (resolver: ComponentResolver) => void
    getBaseUrl: () => string | null
    setBaseUrl: (url: string | null) => void
    isClosingToBaseUrl: (pageUrl: string) => boolean
    clearClosingToBaseUrl: () => void
    stack: Readonly<Ref<readonly ModalContext[]>>
    push: typeof push
    pushFromResponseData: typeof pushFromResponseData
    closeAll: (force?: boolean) => void
    reset: () => void
    visit: typeof visit
    registerLocalModal: typeof registerLocalModal
    removeLocalModal: (name: string) => boolean
}

export function useModalStack(): ModalStack {
    return {
        setComponentResolver: () => {},
        getBaseUrl: () => baseUrl.value,
        setBaseUrl: (url) => (baseUrl.value = url),
        isClosingToBaseUrl: (pageUrl) => {
            if (!closingToBaseUrlTarget) {
                return false
            }

            // Compare paths only, ignoring query strings.
            return new URL(closingToBaseUrlTarget, 'http://x').pathname === new URL(pageUrl, 'http://x').pathname
        },
        clearClosingToBaseUrl: () => (closingToBaseUrlTarget = null),
        stack: readonly(stack) as Readonly<Ref<readonly ModalContext[]>>,
        push,
        pushFromResponseData,
        closeAll: (force = false) => {
            if (force) {
                // Removes every modal at once, without leave transitions.
                stack.value = []
            } else {
                ;[...stack.value].toReversed().forEach((modal) => modal.close())
            }
        },
        reset: () => (stack.value = []),
        visit,
        registerLocalModal,
        removeLocalModal: (name) => delete localModals.value[name],
    }
}
