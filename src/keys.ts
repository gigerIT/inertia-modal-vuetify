import type { InjectionKey } from 'vue'

export const requestCloseKey: InjectionKey<() => Promise<void>> = Symbol('inertia-modal-request-close')
