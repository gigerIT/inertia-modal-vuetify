import { afterEach, describe, expect, it } from 'vitest'
import { except, generateId, generateIdUsing, kebabCase, only, parseResponseData, rejectNullValues, sameUrlPath } from '../../src/helpers'

afterEach(() => generateIdUsing(null))

describe('generateId', () => {
    it('generates unique ids with the modal prefix', () => {
        expect(generateId()).toMatch(/^inertiaui_modal_/)
        expect(generateId('custom_')).toMatch(/^custom_/)
        expect(generateId()).not.toBe(generateId())
    })

    it('uses the callback set with generateIdUsing until it is cleared', () => {
        generateIdUsing(() => 'custom-id')
        expect(generateId()).toBe('custom-id')

        generateIdUsing(null)
        expect(generateId()).toMatch(/^inertiaui_modal_/)
    })
})

describe('parseResponseData', () => {
    it('parses JSON strings and passes objects through', () => {
        expect(parseResponseData('{"component":"Users"}')).toEqual({ component: 'Users' })
        expect(parseResponseData({ component: 'Users' })).toEqual({ component: 'Users' })
    })
})

describe('vanilla helpers the runtime relies on', () => {
    it('filters objects and arrays', () => {
        expect(except({ a: 1, b: 2 }, ['b'])).toEqual({ a: 1 })
        expect(except(['a', 'b', 'c'], ['b'])).toEqual(['a', 'c'])
        expect(only({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 })
        expect(rejectNullValues({ a: 1, b: null })).toEqual({ a: 1 })
    })

    it('kebab-cases event names', () => {
        expect(kebabCase('userCreated')).toBe('user-created')
    })

    it('compares URL paths and ignores query strings', () => {
        expect(sameUrlPath('/users/1', '/users/1')).toBe(true)
        expect(sameUrlPath('/users/1', '/users/2')).toBe(false)
        expect(sameUrlPath('/users?page=1', '/users?page=2')).toBe(true)
        expect(sameUrlPath('http://localhost/users', new URL('http://localhost/users'))).toBe(true)
    })
})
