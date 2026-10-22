import { http } from '@inertiajs/vue3'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import ModalRoot from '../../src/ModalRoot.vue'
import { useModalStack } from '../../src/modalStack'

type Handler = (event: { detail: Record<string, unknown> }) => void

const handlers = vi.hoisted(() => ({}) as Record<string, Handler>)

vi.mock('@inertiajs/vue3', () => ({
    http: { onRequest: vi.fn(() => () => {}), getClient: vi.fn() },
    progress: { start: vi.fn(), finish: vi.fn() },
    router: {
        on: (event: string, handler: Handler) => {
            handlers[event] = handler
            return () => {}
        },
        push: vi.fn(),
        visit: vi.fn(),
    },
    usePage: () => ({ props: {}, version: '' }),
}))

const modalStack = useModalStack()

function openModal() {
    const modal = modalStack.push({}, { component: 'Profile', props: {}, url: '/profile' })
    modal.show()
    return modal
}

function visit(method: string, page: { props: Record<string, unknown> } = { props: {} }) {
    handlers.start({ detail: { visit: { id: method, method } } })
    handlers.success({ detail: { page, visitId: method } })
    handlers.finish({ detail: { visit: { id: method, method } } })
}

// Vitest clears mock calls before each test, so every test renders the root itself.
const render = () => renderToString(createSSRApp({ render: () => h(ModalRoot) }))

beforeEach(async () => {
    modalStack.reset()
    await render()
})

describe('ModalRoot', () => {
    it('does not register its request interceptor during SSR', async () => {
        await render()

        expect(http.onRequest).not.toHaveBeenCalled()
    })

    it('closes the modals after a submission lands on a page without one', () => {
        const modal = openModal()

        visit('post')

        expect(modal.isOpen).toBe(false)
    })

    it('closes them only after the submission finished, so onSuccess can still emit events', () => {
        const modal = openModal()
        const listener = vi.fn()
        modal.on('saved', listener)

        handlers.start({ detail: { visit: { id: '1', method: 'post' } } })
        handlers.success({ detail: { page: { props: {} }, visitId: '1' } })
        modal.emit('saved')
        expect(modal.isOpen).toBe(true)

        handlers.finish({ detail: { visit: { id: '1', method: 'post' } } })
        expect(listener).toHaveBeenCalledOnce()
        expect(modal.isOpen).toBe(false)
    })

    it('keeps the modals open after GET visits such as reloads or polling', () => {
        const modal = openModal()

        visit('get')

        expect(modal.isOpen).toBe(true)
    })

    it('keeps the modals open when the response renders a modal', () => {
        const modal = openModal()

        visit('put', { props: { _inertiaui_modal: { component: 'Profile', props: {}, url: '/profile' } } })

        expect(modal.isOpen).toBe(true)
    })
})
