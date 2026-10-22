import { prefersReducedMotion } from '@inertiaui/vanilla'
import { Transition } from 'vue'

/**
 * A `v-dialog` transition that moves the panel in from off-screen, e.g. `translateX(100%)`.
 * Vuetify only ships short slide transitions, so this uses the Web Animations API.
 */
export function slideTransition(hiddenTransform: string) {
    // Like Vuetify's own transitions, fade instead of moving when motion is reduced.
    const hidden = () => (prefersReducedMotion() ? { opacity: 0 } : { transform: hiddenTransform })

    return {
        component: Transition,
        css: false,
        onEnter: (el: Element, done: () => void) => animate(el, [hidden(), {}], 225, 'cubic-bezier(0, 0, 0.2, 1)', done),
        onLeave: (el: Element, done: () => void) => animate(el, [{}, hidden()], 195, 'cubic-bezier(0.4, 0, 1, 1)', done),
    }
}

function animate(el: Element, keyframes: Keyframe[], duration: number, easing: string, done: () => void) {
    if (!el.animate) {
        return done()
    }

    // Vue treats an argument passed to done() as a cancellation.
    el.animate(keyframes, { duration, easing }).finished.then(
        () => done(),
        () => done(),
    )
}
