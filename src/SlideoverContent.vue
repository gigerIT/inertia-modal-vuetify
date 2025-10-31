<script setup>
import { ref, computed, provide } from "vue";
import {
  VSlideXTransition,
  VSlideXReverseTransition,
} from "vuetify/components";
import CloseButton from "./CloseButton.vue";
import { getMaxWidth } from "./config.js";

const props = defineProps({
  modalContext: {
    type: Object,
    required: true,
  },
  config: {
    type: Object,
    required: true,
  },
});

// Provide modalContext to child components
provide(
  "modalContext",
  computed(() => props.modalContext)
);

const entered = ref(false);

const maxWidthValue = computed(() => getMaxWidth(props.config.maxWidth));

const contentClasses = computed(() => {
  const classes = [];

  // Apply blur if not on top of stack
  if (!props.modalContext.onTopOfStack) {
    classes.push("blur-sm");
  }

  return classes.join(" ");
});

function handleEscapeKey(event) {
  if (props.config?.closeExplicitly) {
    event.preventDefault();
  }
}

function handleClickOutside(event) {
  if (props.config?.closeExplicitly) {
    event.preventDefault();
  }
}
</script>

<template>
  <div
    class="im-slideover-container d-flex align-center position-absolute overflow-y-auto overflow-x-hidden"
    style="inset: 0"
  >
    <div
      class="im-slideover-positioner d-flex align-center min-h-100 w-100"
      :class="{
        'justify-start': config.position === 'left',
        'justify-end': config.position === 'right',
      }"
    >
      <component
        :is="
          config.position === 'left'
            ? VSlideXTransition
            : VSlideXReverseTransition
        "
        appear
        @after-enter="entered = true"
        @after-leave="modalContext.afterLeave"
      >
        <v-card
          v-if="modalContext.isOpen"
          class="im-slideover-wrapper"
          :class="contentClasses"
          :max-width="maxWidthValue"
          width="100%"
          height="100vh"
          min-height="100vh"
          :elevation="2"
          rounded="0"
          :data-inertiaui-modal-entered="entered"
          @keydown.esc="handleEscapeKey"
        >
          <div
            class="im-slideover-content position-relative h-100"
            :class="[
              config.paddingClasses || 'pa-4 pa-sm-6',
              config.panelClasses || '',
            ]"
          >
            <div
              v-if="config.closeButton !== false"
              class="position-absolute pa-3"
              style="right: 0; top: 0; z-index: 1"
            >
              <CloseButton />
            </div>

            <slot :modal-context="modalContext" :config="config" />
          </div>
        </v-card>
      </component>
    </div>
  </div>
</template>

<style scoped>
.blur-sm {
  filter: blur(4px);
}
</style>
