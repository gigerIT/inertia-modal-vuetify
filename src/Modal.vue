<script setup>
import { lockScroll, markAriaHidden } from "@inertiaui/vanilla";
import { HeadlessModal, getConfig } from "@inertiaui/modal-vue";
import ModalContent from "./ModalContent.vue";
import SlideoverContent from "./SlideoverContent.vue";
import { onMounted, onUnmounted, ref } from "vue";

const modal = ref(null);
const lastCloseTrigger = ref(null);

const emits = defineEmits(["after-leave", "blur", "close", "focus", "success"]);

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

let cleanupScrollLock = null;
let cleanupAriaHidden = null;

function setupModalEffects() {
  if (cleanupScrollLock) {
    return;
  }

  cleanupScrollLock = lockScroll();

  const appElement = getConfig("appElement");
  if (appElement) {
    cleanupAriaHidden = markAriaHidden(appElement);
  }
}

function cleanupModalEffects() {
  cleanupScrollLock?.();
  cleanupAriaHidden?.();
  cleanupScrollLock = null;
  cleanupAriaHidden = null;
}

onMounted(() => {
  if (modal.value?.isOpen) {
    setupModalEffects();
  }
});

onUnmounted(() => {
  cleanupModalEffects();
});

function onSuccessEvent() {
  emits("success");
  setupModalEffects();
}

function onCloseEvent() {
  emits("close");
  cleanupModalEffects();
}

function handleClickOutside() {
  lastCloseTrigger.value = "outside";
  queueMicrotask(() => {
    if (lastCloseTrigger.value === "outside") {
      lastCloseTrigger.value = null;
    }
  });
}

function handleModelValueUpdate(value, setOpen, config) {
  if (
    value === false &&
    lastCloseTrigger.value === "outside" &&
    config?.closeOnClickOutside === false
  ) {
    lastCloseTrigger.value = null;
    return;
  }

  lastCloseTrigger.value = null;
  setOpen(value);
}
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
      ...props
    }"
    @success="onSuccessEvent"
    @close="onCloseEvent"
    @focus="emits('focus')"
    @blur="emits('blur')"
  >
    <v-dialog
      :model-value="isOpen"
      @update:model-value="handleModelValueUpdate($event, setOpen, config)"
      @click:outside="handleClickOutside"
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
            v-bind="props"
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
