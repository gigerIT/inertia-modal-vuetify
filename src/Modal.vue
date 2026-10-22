<script setup lang="ts">
import { computed, useTemplateRef, type PropType } from 'vue'
import HeadlessModal from './HeadlessModal.vue'
import ModalContent from './ModalContent.vue'
import type { BeforeClose, Fullscreen, MaxWidth, ModalPosition, ModalSlotProps, ReloadOptions, SlideoverPosition } from './types'

// Upstream props default to null so unset ones fall back to the global config.
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
    title: String,
    fullscreen: { type: [Boolean, String, Number] as PropType<Fullscreen>, default: null },
    beforeClose: Function as PropType<BeforeClose>,
    dialogProps: Object as PropType<Record<string, unknown>>,
    cardProps: Object as PropType<Record<string, unknown>>,
})

const emit = defineEmits<{
    'after-leave': []
    blur: []
    close: []
    focus: []
    success: []
}>()

defineSlots<{
    default?(props: ModalSlotProps): unknown
    title?(props: ModalSlotProps): unknown
    actions?(props: ModalSlotProps): unknown
}>()

const headlessProps = computed(() => ({
    name: props.name,
    slideover: props.slideover,
    closeButton: props.closeButton,
    closeExplicitly: props.closeExplicitly,
    closeOnClickOutside: props.closeOnClickOutside,
    maxWidth: props.maxWidth,
    paddingClasses: props.paddingClasses,
    panelClasses: props.panelClasses,
    position: props.position,
    fullscreen: props.fullscreen,
}))

const modal = useTemplateRef<InstanceType<typeof HeadlessModal>>('modal')

defineExpose({
    afterLeave: () => modal.value?.afterLeave(),
    close: () => modal.value?.close(),
    emit: (event: string, ...args: unknown[]) => modal.value?.emit(event, ...args),
    getChildModal: () => modal.value?.getChildModal(),
    getParentModal: () => modal.value?.getParentModal(),
    reload: (options?: ReloadOptions) => modal.value?.reload(options),
    setOpen: (open: boolean) => modal.value?.setOpen(open),

    get config() {
        return modal.value?.config
    },
    get id() {
        return modal.value?.id
    },
    get index() {
        return modal.value?.index
    },
    get isOpen() {
        return modal.value?.isOpen
    },
    get modalContext() {
        return modal.value?.modalContext
    },
    get onTopOfStack() {
        return modal.value?.onTopOfStack
    },
    get shouldRender() {
        return modal.value?.shouldRender
    },
})
</script>

<template>
    <HeadlessModal
        ref="modal"
        v-bind="headlessProps"
        v-slot="slotProps"
        @success="emit('success')"
        @close="emit('close')"
        @focus="emit('focus')"
        @blur="emit('blur')"
    >
        <ModalContent
            :key="slotProps.id"
            :modal-context="slotProps.modalContext"
            :config="slotProps.config"
            :title
            :before-close
            :dialog-props
            :card-props
            @after-leave="emit('after-leave')"
        >
            <template #default="{ requestClose }">
                <slot v-bind="{ ...slotProps, requestClose }" />
            </template>

            <template v-if="$slots.title" #title="{ requestClose }">
                <slot name="title" v-bind="{ ...slotProps, requestClose }" />
            </template>

            <template v-if="$slots.actions" #actions="{ requestClose }">
                <slot name="actions" v-bind="{ ...slotProps, requestClose }" />
            </template>
        </ModalContent>
    </HeadlessModal>
</template>
