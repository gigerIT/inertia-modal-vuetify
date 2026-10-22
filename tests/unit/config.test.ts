import { beforeEach, describe, expect, it } from 'vitest'
import { getConfig, getConfigByType, getDialogLocation, getMaxWidth, putConfig, resetConfig } from '../../src/config'

beforeEach(() => resetConfig())

describe('getConfig', () => {
    it('reads top-level and nested keys', () => {
        expect(getConfig('type')).toBe('modal')
        expect(getConfig('modal.closeButton')).toBe(true)
        expect(getConfig('slideover.maxWidth')).toBe('md')
        expect(getConfigByType(true, 'position')).toBe('right')
    })

    it('returns null for missing keys', () => {
        expect(getConfig('nonexistent')).toBeNull()
        expect(getConfig('modal.nonexistent')).toBeNull()
        expect(getConfig('modal.closeButton.nonexistent')).toBeNull()
    })
})

describe('defaults', () => {
    it('uses Vuetify classes for the panel', () => {
        expect(getConfig('modal.paddingClasses')).toBe('pa-4 pa-sm-6')
        expect(getConfig('modal.panelClasses')).toBe('')
        expect(getConfig('slideover.paddingClasses')).toBe('pa-4 pa-sm-6')
        expect(getConfig('slideover.panelClasses')).toBe('')
    })

    it('makes only centered modals fullscreen on phones', () => {
        expect(getConfig('modal.fullscreen')).toBe('sm')
        expect(getConfig('slideover.fullscreen')).toBe(false)
    })
})

describe('putConfig', () => {
    it('sets dot-notation keys, creating missing objects', () => {
        putConfig('modal.closeButton', false)
        putConfig('a.b.c', 'nested')

        expect(getConfig('modal.closeButton')).toBe(false)
        expect(getConfig('a.b.c')).toBe('nested')
    })

    it('updates nested objects in place', () => {
        putConfig('modal.extra', { a: 1, b: 2 })
        putConfig('modal.extra.a', 3)

        expect(getConfig('modal.extra')).toEqual({ a: 3, b: 2 })
    })

    it('fills omitted keys of a config object with their defaults', () => {
        putConfig('navigate', true)
        putConfig({ type: 'slideover', modal: { maxWidth: 'lg' }, slideover: { position: 'left' } })

        expect(getConfig('type')).toBe('slideover')
        expect(getConfig('navigate')).toBe(false)
        expect(getConfig('modal.maxWidth')).toBe('lg')
        expect(getConfig('modal.paddingClasses')).toBe('pa-4 pa-sm-6')
        expect(getConfig('slideover.position')).toBe('left')
        expect(getConfig('slideover.maxWidth')).toBe('md')
    })

    it('keeps an explicit null app element', () => {
        putConfig({ appElement: null })

        expect(getConfig('appElement')).toBeNull()
    })
})

describe('resetConfig', () => {
    it('restores the defaults', () => {
        putConfig('type', 'changed')
        putConfig('newKey', 'value')
        putConfig('modal.panelClasses', 'bg-surface-variant')

        resetConfig()

        expect(getConfig('type')).toBe('modal')
        expect(getConfig('newKey')).toBeNull()
        expect(getConfig('modal.panelClasses')).toBe('')
    })
})

describe('getMaxWidth', () => {
    it("maps tokens to Tailwind's max-w widths and falls back to 2xl", () => {
        expect(getMaxWidth('md')).toBe('448px')
        expect(getMaxWidth('2xl')).toBe('672px')
        expect(getMaxWidth('7xl')).toBe('1280px')
        expect(getMaxWidth('huge')).toBe('672px')
        expect(getMaxWidth(null)).toBe('672px')
    })
})

describe('getDialogLocation', () => {
    it('keeps modal positions and centers anything else', () => {
        expect(getDialogLocation('top')).toBe('top')
        expect(getDialogLocation('bottom')).toBe('bottom')
        expect(getDialogLocation('left')).toBe('center')
        expect(getDialogLocation(undefined)).toBe('center')
    })
})
