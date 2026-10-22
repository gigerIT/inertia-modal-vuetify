import { h, type App, type Component, type VNode } from 'vue'
import ModalRoot from './ModalRoot.vue'

/** Renders the Inertia app inside `ModalRoot`, which renders the modal stack. */
export function renderApp(App: Component, props: Record<string, any>): () => VNode {
    return () => h(ModalRoot, () => h(App, props))
}

/** Wraps an app's existing render function in `ModalRoot`. */
export function withInertiaModal(app: App): void {
    const component = app._component as { render?: () => VNode }
    const render = component.render

    if (render) {
        component.render = () => h(ModalRoot, () => render())
    }
}
