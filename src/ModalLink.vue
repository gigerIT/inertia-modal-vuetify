<script setup lang="ts">
import type { RequestPayload } from '@inertiajs/core'
import { computed, onBeforeUnmount, onMounted, provide, reactive, ref, useAttrs, watch, type Component, type PropType } from 'vue'
import { getConfig } from './config'
import { only, rejectNullValues } from './helpers'
import { modalPropNames, prefetch as prefetchModal, useModalStack } from './modalStack'
import type { Fullscreen, HttpMethod, MaxWidth, ModalContext, ModalPosition, PrefetchOption, SlideoverPosition } from './types'

defineOptions({ inheritAttrs: false })

// Modal config props default to null so unset ones fall back to the Modal and the global config.
const props = defineProps({
    href: { type: String, required: true },
    method: { type: String as PropType<HttpMethod>, default: 'get' },
    data: { type: Object as PropType<RequestPayload>, default: () => ({}) },
    as: { type: [String, Object] as PropType<string | Component>, default: 'a' },
    headers: { type: Object as PropType<Record<string, string>>, default: () => ({}) },
    queryStringArrayFormat: { type: String as PropType<'brackets' | 'indices'>, default: 'brackets' },
    navigate: { type: Boolean, default: null },
    prefetch: { type: [Boolean, String, Array] as PropType<PrefetchOption>, default: false },
    cacheFor: { type: Number, default: 30000 },
    closeButton: { type: Boolean, default: null },
    closeExplicitly: { type: Boolean, default: null },
    closeOnClickOutside: { type: Boolean, default: null },
    maxWidth: { type: String as PropType<MaxWidth>, default: null },
    paddingClasses: { type: [Boolean, String] as PropType<string | false>, default: null },
    panelClasses: { type: [Boolean, String] as PropType<string | false>, default: null },
    position: { type: String as PropType<ModalPosition | SlideoverPosition>, default: null },
    slideover: { type: Boolean, default: null },
    fullscreen: { type: [Boolean, String, Number] as PropType<Fullscreen>, default: null },
})

const emit = defineEmits<{
    'after-leave': []
    blur: []
    close: []
    error: [error: unknown]
    focus: []
    start: []
    success: []
    prefetching: []
    prefetched: []
}>()

defineSlots<{ default?(props: { loading: boolean }): unknown }>()

const loading = ref(false)
const modalStack = useModalStack()
const modalContext = ref<ModalContext | null>(null)

provide('modalContext', modalContext)

const shouldNavigate = computed(() => props.navigate ?? (getConfig('navigate') as boolean))

const prefetchModes = computed(() => {
    if (props.prefetch === true) {
        return ['hover']
    }

    return props.prefetch === false ? [] : [props.prefetch].flat()
})

function doPrefetch() {
    prefetchModal(props.href, {
        method: props.method,
        data: props.data,
        headers: props.headers,
        queryStringArrayFormat: props.queryStringArrayFormat,
        cacheFor: props.cacheFor,
        onPrefetching: () => emit('prefetching'),
        onPrefetched: () => emit('prefetched'),
    })
}

let hoverTimeout: ReturnType<typeof setTimeout> | undefined

function onMouseenter() {
    if (prefetchModes.value.includes('hover')) {
        // A short delay skips links the pointer only passes over.
        hoverTimeout = setTimeout(doPrefetch, 75)
    }
}

function onMouseleave() {
    clearTimeout(hoverTimeout)
}

function onMousedown(event: MouseEvent) {
    if (prefetchModes.value.includes('click') && event.button === 0) {
        doPrefetch()
    }
}

onMounted(() => {
    if (prefetchModes.value.includes('mount')) {
        doPrefetch()
    }
})

let isBlurred = false

watch(
    () => modalContext.value?.onTopOfStack,
    (onTopOfStack) => {
        if (!modalContext.value) {
            return
        }

        if (onTopOfStack && isBlurred) {
            emit('focus')
        } else if (!onTopOfStack) {
            emit('blur')
        }

        isBlurred = !onTopOfStack
    },
)

const attrs = useAttrs()
let unsubscribeEventListeners: (() => void) | undefined

onBeforeUnmount(() => {
    unsubscribeEventListeners?.()
    clearTimeout(hoverTimeout)
})

watch(modalContext, (value, oldValue) => {
    if (value && !oldValue) {
        unsubscribeEventListeners = value.registerEventListenersFromAttrs(attrs)
        emit('success')
    }
})

function onAfterLeave() {
    modalContext.value = null
    emit('after-leave')
}

function handle(event: MouseEvent) {
    // Leave modified clicks on links to the browser, e.g. to open a new tab.
    if ((event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) && event.currentTarget instanceof HTMLAnchorElement) {
        return
    }

    event.preventDefault()

    if (loading.value) {
        return
    }

    if (!props.href.startsWith('#')) {
        loading.value = true
        emit('start')
    }

    modalStack
        .visit(
            props.href,
            props.method,
            props.data,
            props.headers,
            rejectNullValues(only(props, modalPropNames)),
            () => emit('close'),
            onAfterLeave,
            props.queryStringArrayFormat,
            shouldNavigate.value,
        )
        .then((context) => (modalContext.value = reactive(context)))
        .catch((error: unknown) => {
            console.error(error)
            emit('error', error)
        })
        .finally(() => (loading.value = false))
}
</script>

<template>
    <component
        :is="as"
        v-bind="$attrs"
        :href
        @click="handle"
        @mouseenter="onMouseenter"
        @mouseleave="onMouseleave"
        @mousedown="onMousedown"
    >
        <template v-if="$slots.default" #default>
            <slot :loading />
        </template>
    </component>
</template>
