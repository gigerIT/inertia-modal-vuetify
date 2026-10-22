import { inject, toValue, type MaybeRef } from 'vue'
import type { ModalContext } from './types'

/** The modal the calling component is rendered in, or `null` outside a modal. */
export default function useModal(): ModalContext | null {
    return toValue(inject<MaybeRef<ModalContext | null>>('modalContext', null))
}
