import { afterEach, describe, expect, it } from 'vitest'
import { getConfig, getDialogLocation, getMaxWidth, putConfig, resetConfig } from '../src/index.js'

afterEach(() => resetConfig())

describe('getMaxWidth', () => {
    it('maps upstream tokens to the Tailwind max-w scale', () => {
        expect(getMaxWidth('md')).toBe('448px')
        expect(getMaxWidth('2xl')).toBe('672px')
        expect(getMaxWidth('7xl')).toBe('1280px')
    })

    it('falls back to 2xl for unknown tokens', () => {
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

describe('config defaults', () => {
    it('replaces the upstream Tailwind classes with Vuetify ones', () => {
        expect(getConfig('modal.paddingClasses')).toBe('pa-4 pa-sm-6')
        expect(getConfig('modal.panelClasses')).toBe('')
        expect(getConfig('slideover.paddingClasses')).toBe('pa-4 pa-sm-6')
        expect(getConfig('slideover.panelClasses')).toBe('')
    })

    it('keeps Vuetify classes when putting a partial config object', () => {
        putConfig({ navigate: true, modal: { maxWidth: 'lg' } })

        expect(getConfig('navigate')).toBe(true)
        expect(getConfig('modal.maxWidth')).toBe('lg')
        expect(getConfig('modal.paddingClasses')).toBe('pa-4 pa-sm-6')
        expect(getConfig('slideover.panelClasses')).toBe('')
    })

    it('lets consumers override and reset the classes', () => {
        putConfig('modal.panelClasses', 'bg-surface-variant')
        expect(getConfig('modal.panelClasses')).toBe('bg-surface-variant')

        resetConfig()
        expect(getConfig('modal.panelClasses')).toBe('')
    })
})
