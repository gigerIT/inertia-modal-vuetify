import { generateId as generateVanillaId } from '@inertiaui/vanilla'

export { except, kebabCase, only, rejectNullValues, sameUrlPath } from '@inertiaui/vanilla'

export function parseResponseData(data: unknown): unknown {
    return typeof data === 'string' ? JSON.parse(data) : data
}

let generateIdUsingCallback: (() => string) | null = null

/** Overrides id generation, e.g. to make request headers predictable in tests. */
export function generateIdUsing(callback: (() => string) | null): void {
    generateIdUsingCallback = callback
}

export function generateId(prefix = 'inertiaui_modal_'): string {
    return generateIdUsingCallback?.() ?? generateVanillaId(prefix)
}
