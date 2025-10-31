<script setup>
import { ref, computed, provide } from "vue";
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
    class="im-modal-container d-flex align-center justify-center pa-4"
    style="position: absolute; inset: 0; overflow-y: auto"
  >
    <div
      class="im-modal-positioner d-flex justify-center"
      :class="{
        'align-start': config.position === 'top',
        'align-center': config.position === 'center',
        'align-end': config.position === 'bottom',
      }"
      style="min-height: 100%; width: 100%"
    >
      <Transition
        appear
        enter-active-class="transition-all duration-300 ease-in-out"
        enter-from-class="opacity-0 translate-y-4 scale-95"
        enter-to-class="opacity-100 translate-y-0 scale-100"
        leave-active-class="transition-all duration-300 ease-in-out"
        leave-from-class="opacity-100 translate-y-0 scale-100"
        leave-to-class="opacity-0 translate-y-4 scale-95"
        @after-enter="entered = true"
        @after-leave="modalContext.afterLeave"
      >
        <v-card
          v-show="entered || modalContext.isOpen"
          class="im-modal-wrapper w-100"
          :class="contentClasses"
          :max-width="maxWidthValue"
          :elevation="2"
          rounded
          position="relative"
          :data-inertiaui-modal-entered="entered"
          @keydown.esc="handleEscapeKey"
        >
          <template v-if="config.closeButton">
            <div class="d-flex justify-end pa-2">
              <CloseButton />
            </div>
          </template>
          <div
            class="im-modal-content"
            :class="[
              config.paddingClasses || 'pa-4 pa-sm-6',
              config.panelClasses || '',
            ]"
          >
            <slot :modal-context="modalContext" :config="config" />
          </div>
        </v-card>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.im-modal-container {
  position: absolute;
  inset: 0;
  overflow-y: auto;
}

.im-modal-positioner {
  min-height: 100%;
  width: 100%;
}

.im-modal-wrapper {
  transition: all 0.3s ease-in-out;
}

.blur-sm {
  filter: blur(4px);
}
</style>
