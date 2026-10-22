import { putConfig as putUpstreamConfig } from '@inertiaui/modal-vue'

// Upstream max-width tokens name Tailwind's max-w-* scale.
const maxWidths = {
    sm: '384px',
    md: '448px',
    lg: '512px',
    xl: '576px',
    '2xl': '672px',
    '3xl': '768px',
    '4xl': '896px',
    '5xl': '1024px',
    '6xl': '1152px',
    '7xl': '1280px',
}

/**
 * Maps an upstream max-width token to a CSS width; unknown tokens fall back to `2xl`.
 */
export function getMaxWidth(maxWidth) {
    return maxWidths[maxWidth] ?? maxWidths['2xl']
}

/**
 * Maps a modal position to a Vuetify dialog location.
 */
export function getDialogLocation(position) {
    return ['top', 'center', 'bottom'].includes(position) ? position : 'center'
}

// Upstream defaults are Tailwind classes; the Vuetify card already provides the panel surface.
const vuetifyClasses = { paddingClasses: 'pa-4 pa-sm-6', panelClasses: '' }

export function putConfig(key, value) {
    if (typeof key !== 'object') {
        return putUpstreamConfig(key, value)
    }

    putUpstreamConfig({
        ...key,
        modal: { ...vuetifyClasses, ...key.modal },
        slideover: { ...vuetifyClasses, ...key.slideover },
    })
}

export function resetConfig() {
    putConfig({})
}

resetConfig()
