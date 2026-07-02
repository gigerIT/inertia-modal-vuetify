# Styling

A fair bit of styling can be adjusted using the [configuration](/configuration) options and Vuetify theme utilities. However, you may want to customize the modal even further using CSS. The adapter keeps public `im-` class hooks on the major elements so you can target them with your own styles.

## Available Classes

You're probably the fastest if you just inspect the modal in your browser and see which classes are used. To give you a head start, here are the classes that are used: all classes are prefixed with `im-` to avoid conflicts with other classes.

| Class | Description |
| --- | --- |
| `im-close-button` | The close button |
| `im-modal-wrapper` | The Vuetify card wrapper for centered modals |
| `im-modal-content` | The actual modal content |
| `im-slideover-dialog` | The teleported Vuetify dialog content wrapper for slideovers |
| `im-slideover-left` | Added to left-positioned slideovers |
| `im-slideover-wrapper` | The Vuetify card wrapper for slideovers |
| `im-slideover-content` | The actual slideover content |
