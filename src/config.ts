import type { GlobalModalConfig, ModalPosition, ModalTypeConfig } from './types'

type Config = Required<Omit<GlobalModalConfig, 'modal' | 'slideover'>> & {
    modal: ModalTypeConfig
    slideover: ModalTypeConfig
}

const defaultConfig: Config = {
    type: 'modal',
    navigate: false,
    appElement: '#app',
    modal: {
        closeButton: true,
        closeExplicitly: false,
        closeOnClickOutside: true,
        maxWidth: '2xl',
        paddingClasses: 'pa-4 pa-sm-6',
        panelClasses: '',
        position: 'center',
        fullscreen: 'sm',
    },
    slideover: {
        closeButton: true,
        closeExplicitly: false,
        closeOnClickOutside: true,
        maxWidth: 'md',
        paddingClasses: 'pa-4 pa-sm-6',
        panelClasses: '',
        position: 'right',
        fullscreen: false,
    },
}

let config: Config

export function resetConfig(): void {
    config = structuredClone(defaultConfig)
}

/** Replaces the configuration (omitted keys get their defaults) or sets one dot-notation key. */
export function putConfig(config: GlobalModalConfig): void
export function putConfig(key: string, value: unknown): void
export function putConfig(key: string | GlobalModalConfig, value?: unknown): void {
    if (typeof key === 'object') {
        config = {
            type: key.type ?? defaultConfig.type,
            navigate: key.navigate ?? defaultConfig.navigate,
            appElement: key.appElement !== undefined ? key.appElement : defaultConfig.appElement,
            modal: { ...defaultConfig.modal, ...key.modal },
            slideover: { ...defaultConfig.slideover, ...key.slideover },
        }
        return
    }

    const keys = key.split('.')
    let current = config as Record<string, unknown>

    for (const segment of keys.slice(0, -1)) {
        current = (current[segment] ??= {}) as Record<string, unknown>
    }

    current[keys[keys.length - 1]] = value
}

/** Reads the whole configuration or one dot-notation key; missing keys return `null`. */
export function getConfig(key?: string): unknown {
    if (key === undefined) {
        return config
    }

    let current: unknown = config

    for (const segment of key.split('.')) {
        if (current === null || typeof current !== 'object') {
            return null
        }

        current = (current as Record<string, unknown>)[segment]
    }

    return current ?? null
}

export function getConfigByType<K extends keyof ModalTypeConfig>(slideover: boolean, key: K): ModalTypeConfig[K] {
    return getConfig(`${slideover ? 'slideover' : 'modal'}.${key}`) as ModalTypeConfig[K]
}

// Max-width tokens name Tailwind's max-w-* scale, like the original package.
const maxWidths: Record<string, string> = {
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
 * Maps a max-width token to a CSS width; unknown tokens fall back to `2xl`.
 */
export function getMaxWidth(maxWidth?: string | null): string {
    return maxWidths[maxWidth ?? ''] ?? maxWidths['2xl']
}

/**
 * Maps a modal position to a Vuetify dialog location.
 */
export function getDialogLocation(position?: string | null): ModalPosition {
    return position === 'top' || position === 'bottom' ? position : 'center'
}

resetConfig()
