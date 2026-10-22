import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { page, userEvent } from 'vitest/browser'
import { h } from 'vue'
import { VCard } from 'vuetify/components/VCard'
import { Modal, useModal, visitModal } from '../../src'
import { content, expectClosed, expectStaysOpen, mountModal, mountModals, open, overlay, reset, stack } from './helpers'

beforeEach(reset)
afterEach(reset)

const pressEscape = () => userEvent.keyboard('{Escape}')
const clickBackdrop = () => userEvent.click(overlay().querySelector('.v-overlay__scrim')!, { position: { x: 5, y: 5 } })
const clickCloseButton = () => userEvent.click(overlay().querySelector('.im-close-button')!)
const rect = (el: Element) => el.getBoundingClientRect()
const longContent = { render: () => Array.from({ length: 100 }, (_, i) => h('p', `Line ${i}`)) }

describe('Modal', () => {
    it('renders the slot in a Vuetify card with Vuetify padding', async () => {
        mountModal()
        await open()

        const body = overlay().querySelector('.im-modal-dialog .im-modal-wrapper.v-card .im-modal-content')!
        expect(body.textContent).toBe('Modal body')
        expect([...body.classList]).toEqual(['im-modal-content', 'pa-4', 'pa-sm-6'])
        expect(getComputedStyle(body).paddingLeft).toBe('24px')
        expect(overlay().getAttribute('role')).toBe('dialog')
        expect(overlay().getAttribute('data-inertiaui-modal-index')).toBe('0')
    })

    it('treats false padding classes as no padding', async () => {
        mountModal({ paddingClasses: false })
        await open()

        expect(getComputedStyle(overlay().querySelector('.im-modal-content')!).paddingLeft).toBe('0px')
    })

    it('closes through the close button and cleans up the stack after leaving', async () => {
        const wrapper = mountModal()
        await open()

        await clickCloseButton()

        await expectClosed()
        expect(wrapper.findComponent(Modal).emitted('after-leave')).toHaveLength(1)
    })

    it('hides the close button when disabled', async () => {
        mountModal({ closeButton: false })
        await open()

        expect(overlay().querySelector('.im-close-button')).toBeNull()
    })

    it('closes on Escape and backdrop click', async () => {
        mountModal()
        await open()
        await pressEscape()
        await expectClosed()

        await open()
        await clickBackdrop()
        await expectClosed()
    })

    it('blocks Escape and backdrop click when closing explicitly', async () => {
        mountModal({ closeExplicitly: true })
        await open()

        await pressEscape()
        await clickBackdrop()
        await expectStaysOpen()
    })

    it('blocks only backdrop click when close-on-click-outside is false', async () => {
        mountModal({ closeOnClickOutside: false })
        await open()

        await clickBackdrop()
        await expectStaysOpen()

        await pressEscape()
        await expectClosed()
    })

    it('cleans up a local modal reopened before its leave transition ends', async () => {
        mountModal()
        const first = await open()

        first.close()
        const second = await visitModal('#test')
        await vi.waitFor(() => expect(overlay(second.id)?.querySelector('[data-inertiaui-modal-entered="true"]')).toBeTruthy())
        expect(stack.value.map((modal) => modal.id)).toEqual([second.id])

        await pressEscape()
        await expectClosed()
    })

    it('provides the modal to slot content of local modals', async () => {
        const CloseFromInside = {
            setup() {
                const modal = useModal()
                return () => h('button', { class: 'inside', onClick: () => modal?.close() })
            },
        }
        mountModal({ content: CloseFromInside })
        await open()

        await userEvent.click(overlay().querySelector('.inside')!)
        await expectClosed()
    })

    it('hides the app element while open and returns focus to the trigger', async () => {
        mountModal()
        const trigger = document.body.appendChild(document.createElement('button'))
        trigger.focus()

        await open()
        expect(document.getElementById('app')!.getAttribute('aria-hidden')).toBe('true')
        expect(overlay().contains(document.activeElement)).toBe(true)

        await pressEscape()
        await expectClosed()
        expect(document.getElementById('app')!.hasAttribute('aria-hidden')).toBe(false)
        expect(document.activeElement).toBe(trigger)
    })

    it('grows the dialog out of the element that opened it', async () => {
        const animate = vi.spyOn(Element.prototype, 'animate')
        mountModal()
        const trigger = document.body.appendChild(document.createElement('button'))
        trigger.focus()

        await open()

        const call = animate.mock.calls.find(([keyframes]) => String((keyframes as Keyframe[])[0]?.transform).includes('scale('))
        expect(call).toBeDefined()
        expect(animate.mock.contexts[animate.mock.calls.indexOf(call!)]).toBe(content())
        animate.mockRestore()
    })

    it('positions modals with the Vuetify dialog location', async () => {
        mountModal({ position: 'top', maxWidth: 'lg' })
        await open()

        expect(rect(content()).top).toBe(24)
        expect(rect(content()).width).toBe(512)
    })

    it('renders slideovers as full-height panels on the requested side', async () => {
        mountModals([
            { name: 'right', slideover: true },
            { name: 'left', slideover: true, position: 'left' },
        ])

        await open('right')
        expect(rect(content())).toMatchObject({ top: 0, right: innerWidth, height: innerHeight, width: 448 })
        expect(getComputedStyle(content().querySelector('.im-slideover-wrapper')!).borderRadius).toBe('0px')

        await pressEscape()
        await expectClosed()

        await open('left')
        expect(content().classList).toContain('im-slideover-left')
        expect(rect(content())).toMatchObject({ top: 0, left: 0, height: innerHeight })
    })

    it('keeps left slideovers on the left in right-to-left apps', async () => {
        mountModal({ slideover: true, position: 'left' }, { locale: { locale: 'ar', rtl: { ar: true } } })
        await open()

        expect(rect(content()).left).toBe(0)
    })

    it('renders bottom slideovers as sheets', async () => {
        mountModal({ slideover: true, position: 'bottom' })
        await open()

        expect(content().classList).toContain('im-slideover-bottom')
        expect(rect(content())).toMatchObject({ bottom: innerHeight, left: (innerWidth - 448) / 2, width: 448 })
    })

    it('only gives the top modal a scrim and hides covered modals', async () => {
        mountModals([{ name: 'first' }, { name: 'second' }])
        const first = await open('first')
        const second = await open('second')

        expect(overlay(second.id).hasAttribute('aria-hidden')).toBe(false)
        expect(overlay(first.id).getAttribute('aria-hidden')).toBe('true')
        expect(content(first.id).style.filter).toBe('blur(4px)')
        await vi.waitFor(() => expect(overlay(first.id).querySelector('.v-overlay__scrim')).toBeNull())

        await userEvent.click(content(second.id).querySelector('.im-modal-content')!)
        await expectStaysOpen()
        expect(stack.value.every((modal) => modal.isOpen)).toBe(true)

        await pressEscape()
        await vi.waitFor(() => expect(stack.value.filter((modal) => modal.shouldRender)).toHaveLength(1))
        expect(overlay(first.id).hasAttribute('aria-hidden')).toBe(false)
        expect(overlay(first.id).querySelector('.v-overlay__scrim')).not.toBeNull()
    })

    describe('card layout', () => {
        it('renders a labelled header and actions around scrolling content', async () => {
            mountModal({ title: 'Edit user', content: longContent, actions: () => h('button', { class: 'save' }, 'Save') })
            await open()

            const title = overlay().querySelector('.im-modal-title')!
            const actions = overlay().querySelector('.im-modal-actions')!
            const body = overlay().querySelector('.im-modal-content')!
            expect(document.getElementById(overlay().getAttribute('aria-labelledby')!)!.textContent).toBe('Edit user')
            expect(title.querySelector('.im-close-button')).not.toBeNull()
            expect(actions.querySelector('.save')).not.toBeNull()

            const titleTop = rect(title).top
            body.scrollTop = 500
            expect(body.scrollTop).toBeGreaterThan(0)
            expect(rect(title).top).toBe(titleTop)
            expect(rect(actions).bottom).toBeLessThanOrEqual(innerHeight)
        })

        it('keeps the close button in view while plain content scrolls', async () => {
            mountModal({ content: longContent })
            await open()

            const closeButton = overlay().querySelector('.im-close-button')!
            const top = rect(closeButton).top
            overlay().querySelector('.im-modal-content')!.scrollTop = 500
            expect(rect(closeButton).top).toBe(top)
        })
    })

    describe('fullscreen', () => {
        it('makes centered modals fullscreen on phones only', async () => {
            await page.viewport(400, 800)
            mountModals([{ name: 'test' }, { name: 'panel', slideover: true }])

            await open()
            expect(overlay().classList).toContain('v-dialog--fullscreen')
            expect(rect(content())).toMatchObject({ width: 400, height: 800 })
            await pressEscape()
            await expectClosed()

            await open('panel')
            expect(overlay().classList).not.toContain('v-dialog--fullscreen')
        })

        it('follows the fullscreen prop and breakpoint', async () => {
            await page.viewport(700, 800)
            mountModals([{ name: 'test' }, { name: 'md', fullscreen: 'md' }, { name: 'never', fullscreen: false }])

            await open()
            expect(overlay().classList).not.toContain('v-dialog--fullscreen')
            await pressEscape()
            await expectClosed()

            await open('md')
            expect(overlay().classList).toContain('v-dialog--fullscreen')
            await pressEscape()
            await expectClosed()

            await page.viewport(400, 800)
            await open('never')
            expect(overlay().classList).not.toContain('v-dialog--fullscreen')
        })
    })

    describe('before-close', () => {
        it('lets the guard keep user-initiated closes from happening', async () => {
            const beforeClose = vi.fn(() => false)
            mountModal({ beforeClose })
            await open()

            await clickCloseButton()
            await pressEscape()
            await clickBackdrop()
            await expectStaysOpen()
            expect(beforeClose).toHaveBeenCalledTimes(3)
        })

        it('closes once an async guard allows it', async () => {
            mountModal({ beforeClose: async () => true })
            await open()

            await pressEscape()
            await expectClosed()
        })

        it('applies to requestClose but not close', async () => {
            mountModal({
                beforeClose: () => false,
                slot: ({ close, requestClose }) => [
                    h('button', { class: 'request', onClick: requestClose }),
                    h('button', { class: 'force', onClick: close }),
                ],
            })
            await open()

            await userEvent.click(overlay().querySelector('.request')!)
            await expectStaysOpen()

            await userEvent.click(overlay().querySelector('.force')!)
            await expectClosed()
        })
    })

    describe('customization', () => {
        it('passes dialog and card props through', async () => {
            mountModal({ dialogProps: { scrim: 'red' }, cardProps: { color: 'primary' } })
            await open()

            expect(overlay().querySelector('.v-overlay__scrim')!.classList).toContain('bg-red')
            expect(overlay().querySelector('.im-modal-wrapper')!.classList).toContain('bg-primary')
        })

        it('scopes Vuetify defaults under InertiaModal to modals', async () => {
            mountModals(
                [{ name: 'test' }],
                { defaults: { InertiaModal: { VDialog: { scrim: 'red', VCard: { color: 'secondary' } } } } },
                () => h(VCard, { class: 'outside' }),
            )
            await open()

            expect(overlay().querySelector('.v-overlay__scrim')!.classList).toContain('bg-red')
            expect(overlay().querySelector('.im-modal-wrapper')!.classList).toContain('bg-secondary')
            expect(document.querySelector('.outside')!.classList).not.toContain('bg-secondary')
        })
    })
})
