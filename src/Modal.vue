<script setup>
import { HeadlessModal } from "@inertiaui/modal-vue";
import ModalContent from "./ModalContent.vue";
import SlideoverContent from "./SlideoverContent.vue";
import { onBeforeMount, onUnmounted, ref, computed } from "vue";

const modal = ref(null);
const rendered = ref(false);

defineEmits(["after-leave", "blur", "close", "focus", "success"]);

defineExpose({
  afterLeave: () => modal.value?.afterLeave(),
  close: () => modal.value?.close(),
  emit: (...args) => modal.value?.emit(...args),
  getChildModal: () => modal.value?.getChildModal(),
  getParentModal: () => modal.value?.getParentModal(),
  reload: (...args) => modal.value?.reload(...args),
  setOpen: (...args) => modal.value?.setOpen(...args),

  get config() {
    return modal.value?.config;
  },
  get id() {
    return modal.value?.id;
  },
  get index() {
    return modal.value?.index;
  },
  get isOpen() {
    return modal.value?.isOpen;
  },
  get modalContext() {
    return modal.value?.modalContext;
  },
  get onTopOfStack() {
    return modal.value?.onTopOfStack;
  },
  get shouldRender() {
    return modal.value?.shouldRender;
  },
});

const dialogZIndex = computed(() => {
  // Vuetify's default dialog z-index is 2400, increase for stacked modals
  return 2400 + (modal.value?.index || 0) * 10;
});
</script>

<template>
  <HeadlessModal
    ref="modal"
    v-slot="{
      afterLeave,
      close,
      config,
      emit,
      getChildModal,
      getParentModal,
      id,
      index,
      isOpen,
      modalContext,
      onTopOfStack,
      reload,
      setOpen,
      shouldRender,
    }"
    @success="$emit('success')"
    @close="$emit('close')"
    @focus="$emit('focus')"
    @blur="$emit('blur')"
  >
    <v-dialog
      :model-value="isOpen"
      @update:model-value="setOpen"
      :data-inertiaui-modal-id="id"
      :data-inertiaui-modal-index="index"
      :aria-hidden="!onTopOfStack"
      :persistent="config?.closeExplicitly"
      :scrim="onTopOfStack ? true : false"
      :close-on-back="!config?.closeExplicitly"
      :content-class="
        config?.slideover
          ? `im-slideover-dialog ${
              config.position === 'left' ? 'im-slideover-left' : ''
            }`
          : undefined
      "
      :transition="config?.slideover ? false : undefined"
      :fullscreen="false"
      :width="config?.slideover ? undefined : 'auto'"
    >
      <template #default>
        <!-- The modal/slideover content itself -->
        <component
          :is="config?.slideover ? SlideoverContent : ModalContent"
          :modal-context="modalContext"
          :config="config"
          @after-leave="$emit('after-leave')"
        >
          <slot
            :id="id"
            :after-leave="afterLeave"
            :close="close"
            :config="config"
            :emit="emit"
            :get-child-modal="getChildModal"
            :get-parent-modal="getParentModal"
            :index="index"
            :is-open="isOpen"
            :modal-context="modalContext"
            :on-top-of-stack="onTopOfStack"
            :reload="reload"
            :set-open="setOpen"
            :should-render="shouldRender"
          />
        </component>
      </template>
    </v-dialog>
  </HeadlessModal>
</template>

<style>
/* Global styles for teleported dialog content */
/* Override Vuetify's .v-dialog > .v-overlay__content rules for slideovers */
.v-dialog > .v-overlay__content.im-slideover-dialog {
  margin: 0 !important;
  max-height: 100% !important;
  height: 100% !important;
  align-items: stretch !important;
  width: 100% !important;
  max-width: 100% !important;
  display: flex !important;
  flex-direction: row !important;
  justify-content: flex-end !important;
}

.v-dialog > .v-overlay__content.im-slideover-dialog.im-slideover-left {
  justify-content: flex-start !important;
}
</style>
