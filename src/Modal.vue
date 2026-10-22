<script setup>
import { HeadlessModal } from '@inertiaui/modal-vue'
import { ref } from 'vue'
import ModalContent from './ModalContent.vue'

const modal = ref(null)

const emit = defineEmits(['after-leave', 'blur', 'close', 'focus', 'success'])

defineExpose({
    afterLeave: () => modal.value?.afterLeave(),
    close: () => modal.value?.close(),
    emit: (...args) => modal.value?.emit(...args),
    getChildModal: () => modal.value?.getChildModal(),
    getParentModal: () => modal.value?.getParentModal(),
    reload: (...args) => modal.value?.reload(...args),
    setOpen: (...args) => modal.value?.setOpen(...args),

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
        v-slot="slotProps"
        @success="emit('success')"
        @close="emit('close')"
        @focus="emit('focus')"
        @blur="emit('blur')"
    >
        <ModalContent
            :modal-context="slotProps.modalContext"
            :config="slotProps.config"
            @after-leave="emit('after-leave')"
        >
            <slot v-bind="slotProps" />
        </ModalContent>
    </HeadlessModal>
</template>
