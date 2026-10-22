import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'
import { ModalBtn } from '../../src'
import { mountModals, reset, stack } from './helpers'

beforeEach(reset)
afterEach(reset)

function mountButton(href: string) {
    mountModals([{ name: 'test' }], {}, () => h(ModalBtn, { href, color: 'primary' }, () => 'Open'))

    return document.querySelector<HTMLAnchorElement>('a.v-btn')!
}

describe('ModalBtn', () => {
    it('renders a Vuetify button link that opens the modal', async () => {
        const button = mountButton('#test')
        expect(button.getAttribute('href')).toBe('#test')
        expect(button.classList).toContain('bg-primary')

        await userEvent.click(button)
        await vi.waitFor(() => expect(stack.value.at(-1)?.isOpen).toBe(true))
    })

    it('leaves modified clicks to the browser', async () => {
        const button = mountButton('#test')

        await userEvent.click(button, { modifiers: ['ControlOrMeta'] })
        await new Promise((resolve) => setTimeout(resolve, 200))
        expect(stack.value).toHaveLength(0)
    })

    it('shows a loading state while the modal request runs', async () => {
        vi.spyOn(console, 'error').mockImplementation(() => {})
        const button = mountButton('/missing-modal')
        const states: boolean[] = []
        new MutationObserver(() => states.push(button.classList.contains('v-btn--loading'))).observe(button, { attributeFilter: ['class'] })

        await userEvent.click(button)
        await vi.waitFor(() => expect(states).toEqual([true, false]))
    })
})
