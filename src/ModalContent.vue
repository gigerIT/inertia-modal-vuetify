<script setup lang="ts">
import { markAriaHidden } from '@inertiaui/vanilla'
import { computed, onBeforeUnmount, onMounted, provide, ref, toRef, useId, useTemplateRef, watch } from 'vue'
import { useDefaults, useDisplay, useRtl } from 'vuetify'
import { VCard, VCardActions, VCardItem } from 'vuetify/components/VCard'
import { VDialog } from 'vuetify/components/VDialog'
import CloseButton from './CloseButton.vue'
import { getConfig, getDialogLocation, getMaxWidth } from './config'
import { requestCloseKey } from './keys'
import { slideTransition } from './transitions'
import type { BeforeClose, ModalConfig, ModalContext } from './types'

const props = defineProps<{
    modalContext: ModalContext
    config: ModalConfig
    title?: string
    beforeClose?: BeforeClose
    dialogProps?: Record<string, unknown>
    cardProps?: Record<string, unknown>
}>()

const emit = defineEmits<{ 'after-leave': [] }>()

const slots = defineSlots<{
    default(props: { requestClose: () => Promise<void> }): unknown
    title?(props: { requestClose: () => Promise<void> }): unknown
    actions?(props: { requestClose: () => Promise<void> }): unknown
}>()

// Local modals have no ModalRenderer, so this is what lets their content call useModal().
provide('modalContext', toRef(props, 'modalContext'))
provide(requestCloseKey, requestClose)

// Scopes `createVuetify({ defaults: { InertiaModal: { VDialog: { ... } } } })` to these modals.
useDefaults({}, 'InertiaModal')

const { isRtl } = useRtl()
const display = useDisplay()
const titleId = useId()
const entered = ref(false)
const dialog = useTemplateRef<InstanceType<typeof VDialog>>('dialog')

// Read before the dialog takes focus: the transition grows from it and focus returns to it.
const trigger =
    typeof document !== 'undefined' && document.activeElement !== document.body ? (document.activeElement as HTMLElement | null) : null

const type = computed(() => (props.config.slideover ? 'slideover' : 'modal'))
const hasTitle = computed(() => !!props.title || !!slots.title)
const showCloseButton = computed(() => props.config.closeButton !== false)

const fullscreen = computed(() => {
    const value = props.config.fullscreen

    if (value === 'mobile') {
        return display.mobile.value
    }

    if (typeof value === 'string') {
        return display.width.value < display.thresholds.value[value]
    }

    return typeof value === 'number' ? display.width.value < value : !!value
})

const layout = computed(() => {
    const { maxWidth, position, slideover } = props.config
    const contentClass = [`im-${type.value}-dialog`, { [`im-slideover-${position}`]: slideover && position !== 'right' }]

    if (!slideover) {
        return fullscreen.value
            ? { fullscreen: true, transition: 'dialog-bottom-transition', contentClass }
            : { location: getDialogLocation(position), maxWidth: getMaxWidth(maxWidth), target: trigger ?? undefined, contentClass }
    }

    if (position === 'bottom') {
        return {
            location: 'bottom' as const,
            width: '100%',
            maxWidth: getMaxWidth(maxWidth),
            fullscreen: fullscreen.value,
            contentClass,
            transition: slideTransition('translateY(100%)'),
        }
    }

    // Slideover sides are physical like upstream, while Vuetify locations follow the text direction.
    const left = position === 'left'

    return {
        location: left !== isRtl.value ? ('left' as const) : ('right' as const),
        width: '100%',
        maxWidth: getMaxWidth(maxWidth),
        height: '100%',
        maxHeight: '100%',
        fullscreen: fullscreen.value,
        contentClass,
        transition: slideTransition(`translateX(${left ? '-100%' : '100%'})`),
    }
})

// Only the top modal dims the page; leaving it unset keeps Vuetify defaults and dialogProps in charge.
const scrim = computed(() => (props.modalContext.onTopOfStack ? (props.dialogProps?.scrim as string | boolean | undefined) : false))

const contentStyle = computed(() => ({
    margin: props.config.slideover && !fullscreen.value ? 0 : undefined,
    filter: props.modalContext.onTopOfStack ? undefined : 'blur(4px)',
    transition: 'filter 0.3s',
}))

let closing = false

async function requestClose() {
    if (closing) {
        return
    }

    closing = true

    try {
        if ((await props.beforeClose?.()) === false) {
            dialog.value?.animateClick()
        } else {
            props.modalContext.close()
        }
    } finally {
        closing = false
    }
}

// How to handle the close v-dialog emits right after click:outside.
let outsideClick: 'close' | 'refuse' | 'ignore' = 'close'

function onClickOutside() {
    if (!props.modalContext.onTopOfStack) {
        // Stacked modals render beside this one, so Vuetify reports clicks in them as outside clicks.
        outsideClick = 'ignore'
    } else if (!props.config.closeExplicitly && props.config.closeOnClickOutside === false) {
        // v-dialog has no separate outside-click switch.
        outsideClick = 'refuse'
    }
}

function onUpdateModelValue(open: boolean) {
    const action = outsideClick
    outsideClick = 'close'

    if (open || action === 'ignore') {
        return
    }

    if (action === 'refuse') {
        dialog.value?.animateClick()
    } else {
        requestClose()
    }
}

function onAfterLeave() {
    emit('after-leave')
    props.modalContext.afterLeave()
}

let restoreAppElement: (() => void) | null = null

function onOpenChange(open: boolean) {
    const appElement = getConfig('appElement')

    if (open) {
        if (typeof appElement === 'string') {
            restoreAppElement ??= markAriaHidden(appElement)
        }

        return
    }

    entered.value = false
    restoreAppElement?.()
    restoreAppElement = null
    trigger?.focus({ preventScroll: true })
}

onMounted(() => watch(() => props.modalContext.isOpen, onOpenChange, { immediate: true, flush: 'post' }))
onBeforeUnmount(() => onOpenChange(false))
</script>

<template>
    <VDialog
        ref="dialog"
        v-bind="{ ...layout, ...dialogProps }"
        :model-value="modalContext.isOpen"
        :persistent="(config.closeExplicitly && modalContext.onTopOfStack) || undefined"
        :scrim
        :close-on-back="false"
        :content-props="{ style: contentStyle }"
        :aria-labelledby="hasTitle ? titleId : undefined"
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
            v-bind="cardProps"
        >
            <VCardItem v-if="hasTitle" :class="`im-${type}-title`">
                <template #title>
                    <span :id="titleId">
                        <slot name="title" :request-close="requestClose">{{ title }}</slot>
                    </span>
                </template>

                <template v-if="showCloseButton" #append>
                    <CloseButton />
                </template>
            </VCardItem>

            <div v-else-if="showCloseButton" class="position-absolute top-0 pa-2" style="inset-inline-end: 0; z-index: 1">
                <CloseButton />
            </div>

            <div
                :class="[`im-${type}-content`, config.paddingClasses, config.panelClasses]"
                :style="{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', paddingTop: hasTitle ? 0 : undefined }"
            >
                <slot :request-close="requestClose" />
            </div>

            <VCardActions v-if="slots.actions" :class="`im-${type}-actions`">
                <slot name="actions" :request-close="requestClose" />
            </VCardActions>
        </VCard>
    </VDialog>
</template>
