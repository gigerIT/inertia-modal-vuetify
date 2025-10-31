/**
 * Maps Tailwind-style max-width values to pixel values for Vuetify
 */
export function getMaxWidth(maxWidth) {
    const widthMap = {
        sm: '320px',
        md: '480px',
        lg: '640px',
        xl: '768px',
        '2xl': '896px',
        '3xl': '1024px',
        '4xl': '1280px',
        '5xl': '1536px',
        '6xl': '1792px',
        '7xl': '2048px',
    }
    
    return widthMap[maxWidth] || widthMap['2xl']
}

/**
 * Maps position values to Vuetify dialog location
 */
export function getDialogLocation(position) {
    const locationMap = {
        top: 'top',
        center: 'center',
        bottom: 'bottom',
    }
    
    return locationMap[position] || 'center'
}

