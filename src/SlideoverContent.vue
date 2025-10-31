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

const slideoverPosition = computed(() => {
  return props.config.position === "left" ? "left" : "right";
});

const translateClass = computed(() => {
  return props.config.position === "left"
    ? "-translate-x-full"
    : "translate-x-full";
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
      <Transition
        appear
        enter-active-class="transition-all duration-300 ease-in-out"
        :enter-from-class="`opacity-0 ${translateClass}`"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-300 ease-in-out"
        leave-from-class="opacity-100 translate-x-0"
        :leave-to-class="`opacity-0 ${translateClass}`"
        @after-enter="entered = true"
        @after-leave="modalContext.afterLeave"
      >
        <v-card
          v-show="entered || modalContext.isOpen"
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
          style="transition: all 0.3s ease-in-out"
        >
          <div
            class="im-slideover-content position-relative h-100"
            :class="[
              config.paddingClasses || 'pa-4 pa-sm-6',
              config.panelClasses || '',
            ]"
          >
            <div
              v-if="config.closeButton"
              class="position-absolute pa-3"
              style="right: 0; top: 0"
            >
              <CloseButton />
            </div>

            <slot :modal-context="modalContext" :config="config" />
          </div>
        </v-card>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.blur-sm {
  filter: blur(4px);
}

.translate-x-full {
  transform: translateX(100%);
}

.-translate-x-full {
  transform: translateX(-100%);
}

.translate-x-0 {
  transform: translateX(0);
}
</style>
