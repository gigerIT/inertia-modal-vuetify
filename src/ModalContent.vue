<script setup>
import { getConfig } from '@inertiaui/modal-vue'
import { markAriaHidden, prefersReducedMotion } from '@inertiaui/vanilla'
import { computed, onBeforeUnmount, onMounted, provide, ref, toRef, Transition, watch } from 'vue'
import { useRtl } from 'vuetify'
import { VCard } from 'vuetify/components/VCard'
import { VDialog } from 'vuetify/components/VDialog'
import CloseButton from './CloseButton.vue'
import { getDialogLocation, getMaxWidth } from './config.js'

const props = defineProps({
    modalContext: {
        type: Object,
        required: true,
    },
    config: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['after-leave'])

// Local modals have no ModalRenderer, so this is what lets their content call useModal().
provide('modalContext', toRef(props, 'modalContext'))

const { isRtl } = useRtl()
const entered = ref(false)
const type = computed(() => (props.config.slideover ? 'slideover' : 'modal'))

const dialogProps = computed(() => {
    const { maxWidth, position, slideover } = props.config

    if (!slideover) {
        return {
            location: getDialogLocation(position),
            maxWidth: getMaxWidth(maxWidth),
            contentClass: 'im-modal-dialog',
        }
    }

    // Slideover sides are physical like upstream, while Vuetify locations follow the text direction.
    const left = position === 'left'

    return {
        location: left !== isRtl.value ? 'left' : 'right',
        width: '100%',
        maxWidth: getMaxWidth(maxWidth),
        height: '100%',
        maxHeight: '100%',
        contentClass: ['im-slideover-dialog', { 'im-slideover-left': left }],
        transition: slideTransition(left ? '-100%' : '100%'),
    }
})

const contentStyle = computed(() => ({
    margin: props.config.slideover ? 0 : undefined,
    filter: props.modalContext.onTopOfStack ? undefined : 'blur(4px)',
    transition: 'filter 0.3s',
}))

function slideTransition(offset) {
    // Like Vuetify's own transitions, fade instead of moving when motion is reduced.
    const hidden = () => (prefersReducedMotion() ? { opacity: 0 } : { transform: `translateX(${offset})` })

    return {
        component: Transition,
        css: false,
        onEnter: (el, done) => animate(el, [hidden(), {}], 225, 'cubic-bezier(0, 0, 0.2, 1)', done),
        onLeave: (el, done) => animate(el, [{}, hidden()], 195, 'cubic-bezier(0.4, 0, 1, 1)', done),
    }
}

function animate(el, keyframes, duration, easing, done) {
    if (!el.animate) {
        return done()
    }

    // Vue treats an argument passed to done() as a cancellation.
    el.animate(keyframes, { duration, easing }).finished.then(
        () => done(),
        () => done(),
    )
}

// v-dialog has no separate outside-click switch, so swallow the close that follows click:outside.
let ignoreClose = false

function onClickOutside() {
    ignoreClose = !props.config.closeExplicitly && props.config.closeOnClickOutside === false
}

function onUpdateModelValue(open) {
    if (!open && !ignoreClose) {
        props.modalContext.close()
    }

    ignoreClose = false
}

function onAfterLeave() {
    emit('after-leave')
    props.modalContext.afterLeave()
}

let restoreAppElement = null
let returnFocusTo = null

function onOpenChange(open) {
    if (open) {
        restoreAppElement ??= markAriaHidden(getConfig('appElement'))
        returnFocusTo ??= document.activeElement
        return
    }

    entered.value = false
    restoreAppElement?.()
    returnFocusTo?.focus({ preventScroll: true })
    restoreAppElement = returnFocusTo = null
}

onMounted(() => watch(() => props.modalContext.isOpen, onOpenChange, { immediate: true, flush: 'post' }))
onBeforeUnmount(() => onOpenChange(false))
</script>

<template>
    <VDialog
        v-bind="dialogProps"
        :model-value="modalContext.isOpen"
        :persistent="config.closeExplicitly"
        :scrim="modalContext.onTopOfStack"
        :close-on-back="false"
        :content-props="{ style: contentStyle }"
        :aria-hidden="!modalContext.onTopOfStack || undefined"
        :data-inertiaui-modal-id="modalContext.id"
        :data-inertiaui-modal-index="modalContext.index"
        @click:outside="onClickOutside"
        @update:model-value="onUpdateModelValue"
        @after-enter="entered = true"
        @after-leave="onAfterLeave"
    >
        <VCard
            :class="`im-${type}-wrapper`"
            :rounded="config.slideover ? 0 : undefined"
            :data-inertiaui-modal-entered="entered"
        >
            <div
                v-if="config.closeButton !== false"
                class="position-absolute top-0 pa-2"
                style="inset-inline-end: 0; z-index: 1"
            >
                <CloseButton />
            </div>

            <div :class="[`im-${type}-content`, config.paddingClasses, config.panelClasses]">
                <slot />
            </div>
        </VCard>
    </VDialog>
</template>
