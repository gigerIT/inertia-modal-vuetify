<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref, useTemplateRef, type Ref } from 'vue'
import type { ModalContext, ReloadOptions } from './types'

const props = withDefaults(
    defineProps<{
        data?: string | string[]
        params?: ReloadOptions
        buffer?: number
        as?: string
        always?: boolean
    }>(),
    { buffer: 0, as: 'div' },
)

defineSlots<{ default?(): unknown; fallback?(): unknown }>()

const modalContext = inject<Ref<ModalContext | null>>('modalContext')

if (!modalContext) {
    throw new Error('WhenVisible component must be used inside a Modal component')
}

const loaded = ref(false)
const root = useTemplateRef<HTMLElement>('root')
let fetching = false
let observer: IntersectionObserver | undefined

function reloadParams(): ReloadOptions {
    if (props.data) {
        return { only: [props.data].flat() }
    }

    if (!props.params) {
        throw new Error('You must provide either a `data` or `params` prop.')
    }

    return props.params
}

onMounted(() => {
    if (!root.value) {
        return
    }

    observer = new IntersectionObserver(
        ([entry]) => {
            if (!entry.isIntersecting) {
                return
            }

            if (!props.always) {
                observer?.disconnect()
            }

            if (fetching) {
                return
            }

            fetching = true
            const params = reloadParams()

            modalContext.value?.reload({
                ...params,
                onStart: () => {
                    fetching = true
                    params.onStart?.()
                },
                onFinish: () => {
                    loaded.value = true
                    fetching = false
                    params.onFinish?.()
                },
            })
        },
        { rootMargin: `${props.buffer}px` },
    )

    observer.observe(root.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
    <component :is="as" ref="root">
        <slot v-if="loaded" />
        <slot v-else name="fallback" />
    </component>
</template>
