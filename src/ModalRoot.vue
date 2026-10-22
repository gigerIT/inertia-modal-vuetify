<script setup lang="ts">
import { http, router, usePage } from '@inertiajs/vue3'
import { onUnmounted, watch } from 'vue'
import { sameUrlPath } from './helpers'
import ModalRenderer from './ModalRenderer.vue'
import { useModalStack } from './modalStack'
import type { ModalResponseData } from './types'

const modalStack = useModalStack()
const $page = usePage()

let isNavigating = false
const pendingModalKeys = new Set<string>()
// Non-GET visits in flight, by id, and whether they should close the modals when they finish.
const submissions = new Map<string, boolean>()

// Deduplicates modal data that has no id.
const getModalKey = (modalData: ModalResponseData) => modalData.id || `${modalData.component}:${modalData.url}`
const modalData = (props?: Record<string, unknown>) => props?._inertiaui_modal as ModalResponseData | undefined

onUnmounted(
    router.on('start', ({ detail: { visit } }) => {
        isNavigating = true

        if (visit.method !== 'get') {
            submissions.set(visit.id, false)
        }
    }),
)

// Inertia 3 swaps in a same-URL response, like a redirect back after submitting a form, without
// a navigate event. Close the modals once such a submission lands on a page without one; waiting
// for finish lets the submission's onSuccess still emit events to the modals.
onUnmounted(
    router.on('success', ({ detail: { page, visitId } }) => {
        if (visitId && submissions.has(visitId) && !modalData(page.props)) {
            submissions.set(visitId, true)
        }
    }),
)

onUnmounted(
    router.on('finish', ({ detail: { visit } }) => {
        isNavigating = false

        if (submissions.get(visit.id)) {
            modalStack.closeAll()
        }

        submissions.delete(visit.id)
    }),
)

onUnmounted(
    router.on('navigate', ({ detail: { page } }) => {
        const modalOnBase = modalData(page.props)

        // router.push() in afterLeave() can fire navigate before the modal data is cleared; don't reopen the modal then.
        if (modalStack.isClosingToBaseUrl(page.url)) {
            modalStack.clearClosingToBaseUrl()
            modalStack.closeAll(true)
            modalStack.setBaseUrl(null)
            return
        }

        // No modal on this page, or history moved to a URL that isn't the modal's.
        if (!modalOnBase || !sameUrlPath(page.url, modalOnBase.url)) {
            modalStack.closeAll(true)
            modalStack.setBaseUrl(null)
            return
        }

        const modalKey = getModalKey(modalOnBase)
        const stack = modalStack.stack.value

        // Skip modals that are being pushed, already open, or reopened with new props (handled by the watcher below).
        if (
            pendingModalKeys.has(modalKey) ||
            (modalOnBase.id && stack.some((modal) => modal.id === modalOnBase.id)) ||
            stack.some((modal) => modal.response.component === modalOnBase.component && sameUrlPath(modal.response.url, modalOnBase.url))
        ) {
            return
        }

        modalStack.setBaseUrl(modalOnBase.baseUrl ?? null)
        pendingModalKeys.add(modalKey)

        modalStack
            .pushFromResponseData(modalOnBase, {}, () => {
                if (!modalOnBase.baseUrl) {
                    console.error('No base url in modal response data so cannot navigate back')
                    return
                }

                // Clear it first so the base page request (and its deferred props) isn't sent as a modal request.
                modalStack.setBaseUrl(null)

                if (!isNavigating && typeof window !== 'undefined' && window.location.href !== modalOnBase.baseUrl) {
                    router.visit(modalOnBase.baseUrl, { preserveScroll: true, preserveState: true })
                }
            })
            .finally(() => pendingModalKeys.delete(modalKey))
    }),
)

// Tells the server which page a modal opens on top of, so back() can redirect there. Inertia 3 loads
// deferred props before the navigate event, so the page props are the fallback.
// It is registered in setup to be in place for that, and only in the browser: during SSR,
// onUnmounted never runs and every render would leak a handler.
const removeRequestInterceptor =
    typeof window === 'undefined'
        ? undefined
        : http.onRequest((config) => {
              const baseUrl = modalStack.getBaseUrl() ?? modalData($page.props)?.baseUrl

              if (baseUrl) {
                  config.headers = { ...config.headers, 'X-InertiaUI-Modal-Base-Url': baseUrl }
              }

              return config
          })

onUnmounted(() => removeRequestInterceptor?.())

watch(
    () => modalData($page.props),
    (newModal, previousModal) => {
        if (!newModal) {
            return
        }

        const isSameModal = (modal: { component?: string; url?: string }) =>
            modal.component === newModal.component && sameUrlPath(modal.url, newModal.url)

        // The server re-rendered an open modal, e.g. after a redirect back to it: refresh its props.
        if (previousModal && isSameModal(previousModal)) {
            modalStack.stack.value[0]?.updateProps(newModal.props ?? {})
            return
        }

        if (!previousModal) {
            modalStack.stack.value.find((modal) => isSameModal(modal.response))?.updateProps(newModal.props ?? {})
        }
    },
)
</script>

<template>
    <slot />

    <ModalRenderer v-if="modalStack.stack.value.length" :index="0" />
</template>
