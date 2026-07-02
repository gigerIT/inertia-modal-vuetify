# Adapter Mirror Map

Upstream ships Vue components styled for its own stack. This package keeps the
upstream API while rendering through Vuetify. When upstream changes behavior,
inspect the upstream source and this adapter mirror.

## Upstream Runtime (External Dependency)

These come from `@inertiaui/modal-vue` and are re-exported or consumed directly:

| Upstream path | Adapter usage |
| --- | --- |
| `vue/src/HeadlessModal.vue` | `src/Modal.vue` slot contract and exposed methods |
| `vue/src/modalStack.js` | stack, focus/blur, child/parent modal behavior |
| `vue/src/useModal.js` | public composable re-export from `src/index.js` |
| `vue/src/inertiauiModal.js` | `renderApp`, `visitModal`, config initialization re-exports |
| `vue/src/config.js` | upstream defaults consumed by `HeadlessModal` |
| `vue/src/Deferred.vue` | public re-export |
| `vue/src/WhenVisible.vue` | public re-export |
| `vue/src/ModalRoot.vue` / renderer | public root/rendering behavior re-export |
| `vue/src/ModalLink.vue` | wrapped by `src/ModalLink.vue` |

Contract changes here usually require adapter source updates, package metadata
updates, or docs changes. Do not copy these files into this repo.

## Adapter-Local Mirrors (Diff On Every Sync)

When upstream changes these areas, diff the upstream file against the adapter
counterpart and port behavior intentionally.

| Upstream | Adapter local | Notes |
| --- | --- | --- |
| `vue/src/Modal.vue` | `src/Modal.vue` | Headless slot props, emitted events, exposed methods, stacking, scrim/backdrop, close behavior |
| `vue/src/ModalContent.vue` | `src/ModalContent.vue` | centered modal transition, close button placement, classes, `afterLeave` timing |
| `vue/src/SlideoverContent.vue` | `src/SlideoverContent.vue` | left/right transitions, width, close button, overflow, `afterLeave` timing |
| `vue/src/CloseButton.vue` | `src/CloseButton.vue` | injected context, close semantics, accessibility label |
| `vue/src/ModalLink.vue` | `src/ModalLink.vue` | attrs/slots and new props/events passthrough |
| `vue/src/config.js` | `src/config.js` | max width tokens, positions, default semantics |
| `vue/src/index.js` or package exports | `src/index.js` | public re-exports and helper availability |

## Vuetify-Specific Contracts

Preserve these adapter behaviors unless intentionally changed:

- `v-dialog` uses upstream `isOpen` and `setOpen`.
- `closeExplicitly` blocks backdrop, Escape, and browser-back closure through
  Vuetify-compatible controls.
- Only top modal has scrim; covered modals receive `aria-hidden`.
- `modalContext.afterLeave` is called from actual Vue/Vuetify leave transition.
- Slideover content uses global selectors because Vuetify dialog content is
  teleported.
- `false` remains meaningful for `closeButton`, `paddingClasses`, and
  `panelClasses` semantics; do not collapse boolean/nullish behavior.
- Public `im-` classes remain customization hooks.

## Common Upstream Changes That Need Adapter Follow-Up

- New slot props or exposed methods in `HeadlessModal` -> update `src/Modal.vue`
  and docs.
- New events (`success`, `close`, `focus`, `blur`, etc.) -> update forwarding and
  demos.
- New close behavior or lifecycle timing -> check `v-dialog` props,
  transitions, `afterLeave`, Escape/backdrop/browser-back behavior.
- New stacked modal behavior -> check scrim, `aria-hidden`, z-index, focus/blur.
- New config keys -> update adapter props, `src/config.js`, docs, examples, demo.
- New `ModalLink` props/events -> ensure `src/ModalLink.vue` forwards them.
- New public exports -> update `src/index.js` and type/docs expectations.
- New peer/runtime dependencies -> update root/demo metadata and Vite externals.
- Upstream switch away from current source layout -> inspect package exports and
  built files before editing adapter code.

## Demo And Integration Touchpoints

Check these when backend shape, setup, or user-visible behavior changes:

- `example/pages/Index.vue`
- `example/components/*.vue`
- `example/main.js`
- `demo-app/resources/js/app.ts`
- `demo-app/resources/js/ssr.ts`
- `demo-app/resources/js/Pages/**`
- `demo-app/routes/web.php`
- `demo-app/app/Http/**` or modal controllers
