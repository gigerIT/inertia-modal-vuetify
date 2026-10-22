<script setup lang="ts">
import { computed, inject, onBeforeUnmount, onMounted, reactive, ref, useAttrs, watch, type PropType, type Ref } from 'vue'
import { getConfig, getConfigByType } from './config'
import ModalRenderer from './ModalRenderer.vue'
import { discardModal, useModalStack } from './modalStack'
import type { Fullscreen, HeadlessModalSlotProps, MaxWidth, ModalConfig, ModalContext, ModalPosition, SlideoverPosition } from './types'

defineOptions({ inheritAttrs: false })

// Props default to null so unset ones fall back to the global config.
const props = defineProps({
    name: String,
    slideover: { type: Boolean, default: null },
    closeButton: { type: Boolean, default: null },
    closeExplicitly: { type: Boolean, default: null },
    closeOnClickOutside: { type: Boolean, default: null },
    maxWidth: { type: String as PropType<MaxWidth>, default: null },
    paddingClasses: { type: [Boolean, String] as PropType<string | false>, default: null },
    panelClasses: { type: [Boolean, String] as PropType<string | false>, default: null },
    position: { type: String as PropType<ModalPosition | SlideoverPosition>, default: null },
    fullscreen: { type: [Boolean, String, Number] as PropType<Fullscreen>, default: null },
})

const emits = defineEmits<{
    'modal-event': [event: string, ...args: unknown[]]
    focus: []
    blur: []
    close: []
    success: []
}>()

defineSlots<{ default?(props: HeadlessModalSlotProps): unknown }>()

const modalStack = useModalStack()
const modalContext: Ref<ModalContext | null> = props.name ? ref(null) : inject('modalContext', ref(null))

const config = computed<ModalConfig>(() => {
    const slideover = modalContext.value?.config?.slideover ?? props.slideover ?? getConfig('type') === 'slideover'

    return {
        slideover,
        closeButton: props.closeButton ?? getConfigByType(slideover, 'closeButton'),
        closeExplicitly: props.closeExplicitly ?? getConfigByType(slideover, 'closeExplicitly'),
        closeOnClickOutside: props.closeOnClickOutside ?? getConfigByType(slideover, 'closeOnClickOutside'),
        maxWidth: props.maxWidth ?? getConfigByType(slideover, 'maxWidth'),
        paddingClasses: props.paddingClasses ?? getConfigByType(slideover, 'paddingClasses'),
        panelClasses: props.panelClasses ?? getConfigByType(slideover, 'panelClasses'),
        position: props.position ?? getConfigByType(slideover, 'position'),
        fullscreen: props.fullscreen ?? getConfigByType(slideover, 'fullscreen'),
        ...modalContext.value?.config,
    }
})

const attrs = useAttrs()
let unsubscribeEventListeners: (() => void) | undefined

function registerEventListeners() {
    unsubscribeEventListeners = modalContext.value?.registerEventListenersFromAttrs(attrs)
}

if (props.name) {
    modalStack.registerLocalModal(props.name, (context) => {
        const previous = modalContext.value

        // Reopened before its leave transition finished: that instance would never get afterLeave().
        if (previous?.shouldRender && previous.id !== context.id) {
            discardModal(previous)
        }

        modalContext.value = reactive(context)
        registerEventListeners()
    })

    onBeforeUnmount(() => modalStack.removeLocalModal(props.name!))
}

onMounted(() => {
    if (!props.name) {
        registerEventListeners()
    }
})

onBeforeUnmount(() => unsubscribeEventListeners?.())

function emit(event: string, ...args: unknown[]) {
    emits('modal-event', event, ...args)
}

defineExpose({
    emit,
    afterLeave: () => modalContext.value?.afterLeave(),
    close: () => modalContext.value?.close(),
    reload: (...args: Parameters<ModalContext['reload']>) => modalContext.value?.reload(...args),
    setOpen: (open: boolean) => modalContext.value?.setOpen(open),
    getChildModal: () => modalContext.value?.getChildModal(),
    getParentModal: () => modalContext.value?.getParentModal(),

    get config() {
        return modalContext.value?.config
    },
    get id() {
        return modalContext.value?.id
    },
    get index() {
        return modalContext.value?.index
    },
    get isOpen() {
        return modalContext.value?.isOpen
    },
    get modalContext() {
        return modalContext.value
    },
    get onTopOfStack() {
        return modalContext.value?.onTopOfStack
    },
    get shouldRender() {
        return modalContext.value?.shouldRender
    },
})

watch(
    () => modalContext.value?.onTopOfStack,
    (onTopOfStack, previousOnTopOfStack) => {
        if (onTopOfStack && !previousOnTopOfStack) {
            emits('focus')
        } else if (!onTopOfStack && previousOnTopOfStack) {
            emits('blur')
        }
    },
)

watch(
    () => modalContext.value?.isOpen,
    (isOpen, previousIsOpen) => {
        if (isOpen) {
            emits('success')
        } else if (previousIsOpen === true) {
            // Not when first mounting closed.
            emits('close')
        }
    },
    { immediate: true },
)

// The next modal in the stack renders inside this one.
const nextIndex = computed(() => {
    const context = modalContext.value

    return context ? modalStack.stack.value.find((modal) => modal.shouldRender && modal.index > context.index)?.index : undefined
})
</script>

<template>
    <slot
        v-if="modalContext?.shouldRender"
        v-bind="modalContext.props"
        :id="modalContext.id"
        :after-leave="modalContext.afterLeave"
        :close="modalContext.close"
        :config
        :emit
        :get-child-modal="modalContext.getChildModal"
        :get-parent-modal="modalContext.getParentModal"
        :index="modalContext.index"
        :is-open="modalContext.isOpen"
        :modal-context
        :on-top-of-stack="modalContext.onTopOfStack"
        :reload="modalContext.reload"
        :set-open="modalContext.setOpen"
        :should-render="modalContext.shouldRender"
    />

    <ModalRenderer v-if="nextIndex" :index="nextIndex" />
</template>
