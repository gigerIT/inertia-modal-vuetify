import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { userEvent } from 'vitest/browser'
import { h } from 'vue'
import { ModalLink } from '../../src'
import { mountModals, overlay, reset, stack } from './helpers'

beforeEach(reset)
afterEach(reset)

function mountLink(props: Record<string, unknown>) {
    mountModals([{ name: 'test' }], {}, () => h(ModalLink, { href: '#test', class: 'link', ...props }, () => 'Open'))

    return document.querySelector<HTMLElement>('.link')!
}

describe('ModalLink', () => {
    it('opens the modal and passes its config props along', async () => {
        await userEvent.click(mountLink({ fullscreen: true }))

        await vi.waitFor(() => expect(stack.value.at(-1)?.isOpen).toBe(true))
        await vi.waitFor(() => expect(overlay().classList).toContain('v-dialog--fullscreen'))
    })

    it('leaves modified clicks on links to the browser', async () => {
        await userEvent.click(mountLink({}), { modifiers: ['ControlOrMeta'] })
        await new Promise((resolve) => setTimeout(resolve, 200))

        expect(stack.value).toHaveLength(0)
    })

    it('still opens the modal on modified clicks when it is not a link', async () => {
        await userEvent.click(mountLink({ as: 'button' }), { modifiers: ['ControlOrMeta'] })

        await vi.waitFor(() => expect(stack.value.at(-1)?.isOpen).toBe(true))
    })
})
