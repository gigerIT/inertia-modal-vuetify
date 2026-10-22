import { mount } from '@vue/test-utils'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { h } from 'vue'
import { createVuetify } from 'vuetify'
import { Modal, useModal, useModalStack, visitModal } from '../src/index.js'

const vuetify = createVuetify()
const { stack } = useModalStack()
let wrapper

function mountModals(...modals) {
    const app = document.createElement('div')
    app.id = 'app'
    document.body.append(app)

    const render = (content) => (typeof content === 'string' ? content : h(content))

    wrapper = mount(() => modals.map(({ content = 'Modal body', ...props }) => h(Modal, props, () => render(content))), {
        attachTo: app,
        global: { plugins: [vuetify], stubs: { transition: false } },
    })
}

function mountModal(props = {}) {
    mountModals({ name: 'test', ...props })
}

async function open(name = 'test') {
    const modal = await visitModal(`#${name}`)
    await vi.waitFor(() => expect(overlay(modal.id).querySelector('[data-inertiaui-modal-entered="true"]')).not.toBeNull())

    return modal
}

function overlay(id = stack.value.at(-1)?.id) {
    return document.querySelector(`.v-overlay[data-inertiaui-modal-id="${id}"]`)
}

async function expectClosed() {
    await vi.waitFor(() => expect(stack.value).toHaveLength(0))
    expect(document.querySelector('.v-overlay')).toBeNull()
}

function pressEscape() {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
}

function clickScrim() {
    const scrim = overlay().querySelector('.v-overlay__scrim')
    scrim.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }))
    scrim.dispatchEvent(new MouseEvent('click', { bubbles: true }))
}

async function expectStaysOpen() {
    await new Promise((resolve) => setTimeout(resolve, 50))
    expect(stack.value[0].isOpen).toBe(true)
}

afterEach(() => {
    wrapper?.unmount()
    useModalStack().reset()
    document.body.innerHTML = ''
})

describe('Modal', () => {
    it('renders the slot in a Vuetify dialog with the default Vuetify classes', async () => {
        mountModal()
        await open()

        const content = overlay().querySelector('.im-modal-dialog .im-modal-wrapper.v-card .im-modal-content')
        expect(content.textContent).toBe('Modal body')
        expect([...content.classList]).toEqual(['im-modal-content', 'pa-4', 'pa-sm-6'])
        expect(overlay().getAttribute('data-inertiaui-modal-index')).toBe('0')
    })

    it('treats false padding classes as no padding', async () => {
        mountModal({ paddingClasses: false })
        await open()

        expect([...overlay().querySelector('.im-modal-content').classList]).toEqual(['im-modal-content'])
    })

    it('closes through the close button and cleans up the stack after leaving', async () => {
        mountModal()
        await open()

        overlay().querySelector('.im-close-button').click()

        await expectClosed()
        expect(wrapper.findComponent(Modal).emitted('after-leave')).toHaveLength(1)
    })

    it('hides the close button when disabled', async () => {
        mountModal({ closeButton: false })
        await open()

        expect(overlay().querySelector('.im-close-button')).toBeNull()
    })

    it('closes on Escape and outside click', async () => {
        mountModal()
        await open()
        pressEscape()
        await expectClosed()

        await open()
        clickScrim()
        await expectClosed()
    })

    it('blocks Escape and outside click when closing explicitly', async () => {
        mountModal({ closeExplicitly: true })
        await open()

        pressEscape()
        clickScrim()
        await expectStaysOpen()
    })

    it('blocks only outside click when close-on-click-outside is false', async () => {
        mountModal({ closeOnClickOutside: false })
        await open()

        clickScrim()
        await expectStaysOpen()

        pressEscape()
        await expectClosed()
    })

    it('provides the modal to slot content of local modals', async () => {
        const CloseFromInside = {
            setup() {
                const modal = useModal()
                return () => h('button', { class: 'inside', onClick: () => modal.close() })
            },
        }
        mountModal({ content: CloseFromInside })
        await open()

        overlay().querySelector('.inside').click()
        await expectClosed()
    })

    it('hides the app element and returns focus while open', async () => {
        const trigger = document.createElement('button')
        document.body.append(trigger)
        trigger.focus()

        mountModal()
        await open()
        expect(document.getElementById('app').getAttribute('aria-hidden')).toBe('true')

        pressEscape()
        await expectClosed()
        expect(document.getElementById('app').hasAttribute('aria-hidden')).toBe(false)
        expect(document.activeElement).toBe(trigger)
    })

    it('positions modals with the Vuetify dialog location', async () => {
        mountModal({ position: 'top', maxWidth: 'lg' })
        await open()

        expect(overlay().classList).toContain('v-overlay--align-start')
        expect(overlay().querySelector('.v-overlay__content').style.maxWidth).toBe('512px')
    })

    it('renders slideovers as full-height panels on the requested side', async () => {
        mountModals({ name: 'right', slideover: true }, { name: 'left', slideover: true, position: 'left' })

        await open('right')
        let content = overlay().querySelector('.v-overlay__content')
        expect(overlay().classList).toContain('v-overlay--justify-end')
        expect(content.classList).toContain('im-slideover-dialog')
        expect(content.style.height).toBe('100%')
        expect(content.style.maxWidth).toBe('448px')
        expect(content.querySelector('.im-slideover-wrapper').classList).toContain('rounded-0')

        pressEscape()
        await expectClosed()

        await open('left')
        content = overlay().querySelector('.v-overlay__content')
        expect(overlay().classList).toContain('v-overlay--justify-start')
        expect(content.classList).toContain('im-slideover-left')
    })

    it('only gives the top modal a scrim and hides covered modals', async () => {
        mountModals({ name: 'first' }, { name: 'second' })
        const first = await open('first')
        const second = await open('second')

        expect(overlay(second.id).hasAttribute('aria-hidden')).toBe(false)
        expect(overlay(first.id).getAttribute('aria-hidden')).toBe('true')
        expect(overlay(first.id).querySelector('.v-overlay__content').style.filter).toBe('blur(4px)')
        await vi.waitFor(() => expect(overlay(first.id).querySelector('.v-overlay__scrim')).toBeNull())

        pressEscape()
        await vi.waitFor(() => expect(stack.value.filter((modal) => modal.shouldRender)).toHaveLength(1))
        expect(overlay(first.id).hasAttribute('aria-hidden')).toBe(false)
        expect(overlay(first.id).querySelector('.v-overlay__scrim')).not.toBeNull()
    })
})
