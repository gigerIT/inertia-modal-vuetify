import 'vuetify/styles'
import { mount, type VueWrapper } from '@vue/test-utils'
import { expect, vi } from 'vitest'
import { page } from 'vitest/browser'
import { h, type Component, type VNode } from 'vue'
import { createVuetify, type VuetifyOptions } from 'vuetify'
import { Modal, useModalStack, visitModal, type ModalSlotProps } from '../../src'

export const { stack } = useModalStack()

type Slot = () => VNode | VNode[] | string

export interface ModalSpec extends Record<string, unknown> {
    content?: string | Component
    slot?: (props: ModalSlotProps) => VNode | VNode[]
    actions?: Slot
}

let wrapper: VueWrapper | undefined

const render = (body: string | Component) => (typeof body === 'string' ? body : h(body))

export function mountModals(modals: ModalSpec[], vuetify: VuetifyOptions = {}, extra: Slot = () => []) {
    const app = document.createElement('div')
    app.id = 'app'
    document.body.append(app)

    wrapper = mount(
        () => [
            ...modals.map(({ content: body = 'Modal body', slot, actions, ...props }) =>
                h(Modal, props, { default: slot ?? (() => render(body)), ...(actions ? { actions } : {}) }),
            ),
            extra(),
        ],
        { attachTo: app, global: { plugins: [createVuetify(vuetify)], stubs: { transition: false } } },
    )

    return wrapper
}

export function mountModal(props: ModalSpec = {}, vuetify?: VuetifyOptions) {
    return mountModals([{ name: 'test', ...props }], vuetify)
}

export function overlay(id = stack.value.at(-1)?.id): HTMLElement {
    return document.querySelector(`.v-overlay[data-inertiaui-modal-id="${id}"]`) as HTMLElement
}

export function content(id?: string): HTMLElement {
    return overlay(id).querySelector('.v-overlay__content') as HTMLElement
}

export async function open(name = 'test') {
    const modal = await visitModal(`#${name}`)
    await vi.waitFor(() => expect(overlay(modal.id)?.querySelector('[data-inertiaui-modal-entered="true"]')).toBeTruthy(), {
        timeout: 2000,
    })

    return modal
}

export async function expectClosed() {
    await vi.waitFor(() => expect(stack.value).toHaveLength(0), { timeout: 2000 })
    expect(document.querySelector('.v-overlay')).toBeNull()
}

export async function expectStaysOpen() {
    await new Promise((resolve) => setTimeout(resolve, 300))
    expect(stack.value.at(-1)?.isOpen).toBe(true)
}

export async function reset() {
    vi.restoreAllMocks()
    wrapper?.unmount()
    wrapper = undefined
    useModalStack().reset()
    document.body.innerHTML = ''
    await page.viewport(1280, 800)
}
