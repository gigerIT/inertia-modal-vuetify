# Styling

A fair bit of styling can be adjusted using the [configuration](/configuration) options and Vuetify theme utilities. However, you may want to customize the modal even further using CSS. The package keeps public `im-` class hooks on the major elements so you can target them with your own styles.

## Available Classes

Vuetify teleports dialogs out of your component tree, so target these classes from global (unscoped) styles.

You're probably the fastest if you just inspect the modal in your browser and see which classes are used. To give you a head start, here are the classes that are used: all classes are prefixed with `im-` to avoid conflicts with other classes.

| Class | Description |
| --- | --- |
| `im-close-button` | The close button |
| `im-modal-dialog` | The teleported Vuetify dialog content wrapper for centered modals |
| `im-modal-wrapper` | The Vuetify card wrapper for centered modals |
| `im-modal-title` | The card header when the modal has a title |
| `im-modal-content` | The actual modal content |
| `im-modal-actions` | The card actions when the modal has an `actions` slot |
| `im-slideover-dialog` | The teleported Vuetify dialog content wrapper for slideovers |
| `im-slideover-left` | Added to left-positioned slideovers |
| `im-slideover-bottom` | Added to bottom sheets |
| `im-slideover-wrapper` | The Vuetify card wrapper for slideovers |
| `im-slideover-title` | The card header when the slideover has a title |
| `im-slideover-content` | The actual slideover content |
| `im-slideover-actions` | The card actions when the slideover has an `actions` slot |

## Vuetify Defaults

To style every modal without touching other dialogs, use Vuetify's global defaults under the `InertiaModal` key. Content defaults nest under `VDialog`, like Vuetify's own dialogs:

```js
createVuetify({
    defaults: {
        InertiaModal: {
            VDialog: {
                scrim: 'primary',
                VCard: { rounded: 'xl' },
                VBtn: { variant: 'tonal' },
            },
        },
    },
})
```

For a single modal, use the `dialog-props` and `card-props` props.
