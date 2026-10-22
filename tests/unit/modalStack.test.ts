import { router, usePage } from '@inertiajs/vue3'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick, type Component } from 'vue'
import { generateIdUsing } from '../../src/helpers'
import { discardModal, modalPropNames, ModalInstance, useModalStack, visitModal } from '../../src/modalStack'
import type { ModalConfig, ModalResponseData } from '../../src/types'

const request = vi.fn()
const progress = vi.hoisted(() => ({ start: vi.fn(), finish: vi.fn() }))

vi.mock('@inertiajs/vue3', () => ({
    http: { getClient: () => ({ request }) },
    progress,
    router: { resolveComponent: vi.fn(), push: vi.fn() },
    usePage: vi.fn(() => ({ version: '1.0' })),
}))

const modalStack = useModalStack()
const response = (props: Record<string, unknown> = {}): ModalResponseData => ({ props, url: '/test', component: 'Test', version: '1' })
const push = (component: Component = {}, data = response(), config?: ModalConfig, onClose?: () => void, afterLeave?: () => void) =>
    modalStack.push(component, data, config, onClose, afterLeave)

afterEach(() => {
    modalStack.reset()
    generateIdUsing(null)
})

describe('modal stack', () => {
    it('starts empty and adds pushed modals', () => {
        expect(modalStack.stack.value).toHaveLength(0)

        const component = { name: 'Test' }
        const config = { closeButton: true }
        const modal = push(component, response(), config)

        expect(modalStack.stack.value).toHaveLength(1)
        expect(modal.component).toBe(component)
        expect(modal.config).toBe(config)
    })

    it('gives modals without a response id unique ids', () => {
        expect(push().id).not.toBe(push().id)
    })

    it('opens pushed modals on the next tick', async () => {
        const modal = push()
        expect(modal.isOpen).toBe(false)

        await nextTick()
        expect(modal.isOpen).toBe(true)
        expect(modal.shouldRender).toBe(true)
    })

    it('finds parent and child modals', () => {
        const [first, second, third] = [push(), push(), push()]
        ;[first, second, third].forEach((modal) => modal.show())

        expect(first.getParentModal()).toBeNull()
        expect(first.getChildModal()?.id).toBe(second.id)
        expect(second.getParentModal()?.id).toBe(first.id)
        expect(second.getChildModal()?.id).toBe(third.id)
        expect(third.getParentModal()?.id).toBe(second.id)
        expect(third.getChildModal()).toBeNull()
    })

    it('knows which modal is on top', () => {
        const first = push()
        expect(first.onTopOfStack.value).toBe(true)

        const second = push()
        second.show()
        expect(first.onTopOfStack.value).toBe(false)
        expect(second.onTopOfStack.value).toBe(true)
    })

    it('keeps a closed modal in the stack until its leave transition ends', () => {
        const onClose = vi.fn()
        const afterLeave = vi.fn()
        const modal = push({}, response(), {}, onClose, afterLeave)
        modal.show()

        modal.close()
        expect(modal.isOpen).toBe(false)
        expect(onClose).toHaveBeenCalledOnce()
        expect(modalStack.stack.value).toHaveLength(1)

        modal.afterLeave()
        expect(afterLeave).toHaveBeenCalledOnce()
        expect(modalStack.stack.value).toHaveLength(0)
    })

    it('discards a modal right away', () => {
        const onClose = vi.fn()
        const afterLeave = vi.fn()
        const first = push({}, response(), {}, onClose, afterLeave)
        const second = push()
        first.show()

        discardModal(modalStack.stack.value[0])

        expect(onClose).toHaveBeenCalledOnce()
        expect(afterLeave).toHaveBeenCalledOnce()
        expect(modalStack.stack.value.map((modal) => modal.id)).toEqual([second.id])
    })

    it('dispatches events to listeners', () => {
        const modal = push()
        const callback = vi.fn()

        modal.on('userCreated', callback)
        modal.emit('user-created', 'arg')
        modal.off('user-created', callback)
        modal.emit('user-created', 'arg')

        expect(callback).toHaveBeenCalledOnce()
        expect(callback).toHaveBeenCalledWith('arg')
    })

    it('registers listeners from attrs', () => {
        const modal = push()
        const callback = vi.fn()

        const unsubscribe = modal.registerEventListenersFromAttrs({ onUserCreated: callback, class: 'x' })
        modal.emit('user-created')
        unsubscribe()
        modal.emit('user-created')

        expect(callback).toHaveBeenCalledOnce()
    })
})

const reloadHeaders = (partialData: string) => ({
    Accept: 'text/html, application/xhtml+xml',
    'X-Inertia': 'true',
    'X-Inertia-Partial-Component': 'Test',
    'X-Inertia-Version': '1',
    'X-Inertia-Partial-Data': partialData,
    'X-InertiaUI-Modal': 'inertiaui_modal_uuid',
    'X-InertiaUI-Modal-Base-Url': '',
})

describe('reload', () => {
    beforeEach(() => generateIdUsing(() => 'inertiaui_modal_uuid'))

    it('requests all props by default and merges the result', async () => {
        const modal = push({}, response({ test: 'initial', another: 'prop' }))
        request.mockResolvedValue({ data: JSON.stringify({ props: { test: 'updated', another: 'updated prop' } }) })

        await modal.reload()

        expect(request).toHaveBeenCalledWith({
            method: 'get',
            url: '/test',
            data: undefined,
            params: {},
            headers: reloadHeaders('test,another'),
        })
        expect(modal.props.value).toEqual({ test: 'updated', another: 'updated prop' })
    })

    it('limits the request with only and except', async () => {
        const modal = push({}, response({ test: 'initial', another: 'prop', third: 'value' }))
        request.mockResolvedValue({ data: JSON.stringify({ props: { test: 'updated' } }) })

        await modal.reload({ only: ['test'] })
        expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ headers: reloadHeaders('test') }))

        await modal.reload({ except: ['another'] })
        expect(request).toHaveBeenLastCalledWith(expect.objectContaining({ headers: reloadHeaders('test,third') }))
        expect(modal.props.value).toEqual({ test: 'updated', another: 'prop', third: 'value' })
    })

    it('reports failures through the callbacks', async () => {
        const modal = push()
        const onError = vi.fn()
        const onFinish = vi.fn()
        request.mockRejectedValue(new Error('Network Error'))

        await modal.reload({ onError, onFinish })

        expect(onError).toHaveBeenCalledWith(new Error('Network Error'))
        expect(onFinish).toHaveBeenCalledOnce()
    })
})

describe('visit', () => {
    beforeEach(() => generateIdUsing(() => 'inertiaui_modal_uuid'))

    it('requests the modal and pushes it', async () => {
        const component: Component = { name: 'Test' }
        const data = { component: 'Test', props: { testProp: 'value' }, url: '/test-url', version: '1' }
        request.mockResolvedValue({ data: JSON.stringify(data) })
        vi.mocked(router.resolveComponent).mockResolvedValue(component)

        const modal = await modalStack.visit('/test-url', 'get', { key: 'value' }, { 'Custom-Header': 'Test' }, { closeButton: true })

        expect(request).toHaveBeenCalledWith({
            url: '/test-url?key=value',
            method: 'get',
            data: {},
            headers: {
                'Custom-Header': 'Test',
                Accept: 'text/html, application/xhtml+xml',
                'X-Requested-With': 'XMLHttpRequest',
                'X-Inertia': 'true',
                'X-Inertia-Version': '1.0',
                'X-InertiaUI-Modal': 'inertiaui_modal_uuid',
                'X-InertiaUI-Modal-Base-Url': expect.any(String),
            },
        })
        expect(modal.component).toBe(component)
        expect(modal.response).toEqual(data)
        expect(modal.config).toEqual({ closeButton: true })
        expect(modalStack.stack.value).toHaveLength(1)
        expect(progress.start).toHaveBeenCalledOnce()
        expect(progress.finish).toHaveBeenCalledOnce()
    })

    it('rejects failed requests without pushing a modal', async () => {
        request.mockRejectedValue(new Error('Network Error'))

        await expect(modalStack.visit('/test-url', 'get')).rejects.toThrow('Network Error')
        expect(modalStack.stack.value).toHaveLength(0)
    })

    it('rejects responses that are not modals', async () => {
        request.mockResolvedValue({ data: { redirect: true } })

        await expect(modalStack.visit('/test-url', 'get')).rejects.toThrow('Invalid modal response')
    })

    it('opens the modal when the app turned the progress bar off', async () => {
        progress.start.mockImplementationOnce(() => {
            throw new TypeError("Cannot read properties of undefined (reading 'querySelector')")
        })
        request.mockResolvedValue({ data: response() })
        vi.mocked(router.resolveComponent).mockResolvedValue({})

        await expect(modalStack.visit('/test', 'get')).resolves.toBeInstanceOf(ModalInstance)
    })

    it('rejects instead of throwing for unregistered local modals', async () => {
        await expect(modalStack.visit('#missing', 'get')).rejects.toThrow('The local modal "missing" has not been registered.')
    })

    it('pushes registered local modals with their props', async () => {
        const callback = vi.fn()
        modalStack.registerLocalModal('confirm', callback)

        const modal = await visitModal('#confirm', { props: { item: 1 }, listeners: { confirmed: vi.fn() } })

        expect(callback).toHaveBeenCalledWith(modal)
        expect(modal.name).toBe('confirm')
        expect(modal.props.value).toEqual({ item: 1 })
        expect(modal.listeners).toHaveProperty('confirmed')
        modalStack.removeLocalModal('confirm')
    })

    it('sends the page version', async () => {
        vi.mocked(usePage).mockReturnValueOnce({ version: 'abc' } as ReturnType<typeof usePage>)
        request.mockResolvedValue({ data: response() })
        vi.mocked(router.resolveComponent).mockResolvedValue({})

        await modalStack.visit('/test', 'get')

        expect(request.mock.calls[0][0].headers['X-Inertia-Version']).toBe('abc')
    })
})

describe('modalPropNames', () => {
    it('lists the config props a link passes to its modal', () => {
        expect(modalPropNames).toEqual([
            'closeButton',
            'closeExplicitly',
            'closeOnClickOutside',
            'maxWidth',
            'paddingClasses',
            'panelClasses',
            'position',
            'slideover',
            'fullscreen',
        ])
    })
})
