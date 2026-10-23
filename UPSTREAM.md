# Upstream Tracker

The modal runtime in `src/` is a TypeScript port of `@inertiaui/modal-vue`
from `inertiaui/modal` and talks to that repository's Laravel package. Upstream
changes reach this package only when they are ported with the
`sync-inertia-modal-upstream` skill (`.agents/skills/`).

## Source

- Repository: https://github.com/inertiaui/modal.git
- Branch: 3.x
- Synced commit: `e8a4d2672bb67051177add51ac58ee82176330e5`
- Synced commit title: `Navbar`
- Synced at: `2026-10-22`
- Matches release: `inertiaui/modal` and `@inertiaui/modal-vue` 3.1.2

## Divergences

Runtime:

- `ModalRoot` closes the modals when a non-GET visit finishes on a page
  without `_inertiaui_modal`. Inertia 3 swaps in a same-URL response, such as
  a redirect back, without a `navigate` event (inertiaui/modal#228).
- `ModalRoot` registers its request interceptor only in the browser; upstream
  leaks one per SSR render (inertiaui/modal#284, fix in #288).
- `HeadlessModal` discards the previous stack entry when a local modal is
  reopened while it is still leaving (inertiaui/modal#290).
- Modal visits work when the app sets Inertia's `progress: false`; upstream's
  `progress.start()` throws and the visit fails. Not reported upstream.
- Navigate-mode visits served from the prefetch cache record the base URL
  first, so closing restores it. Not reported upstream.
- `renderApp` types its props as `Record<string, any>` (inertiaui/modal#289).
- `ModalInstance.reload()` returns a promise.
- `ModalLink` leaves Ctrl/Cmd/Shift/Alt-clicks on links to the browser.
- `ModalLink` passes a default slot to `as` only when it has one; an empty
  slot hides `v-btn`'s `text` and `icon` props.
- `HeadlessModal`'s exposed `modalContext` returns the modal instance;
  upstream's returns `undefined`.
- `WhenVisible`'s error names `WhenVisible` instead of `Deferred`.

Presentation:

- `Modal.vue`, `ModalContent.vue`, and `CloseButton.vue` render Vuetify
  `v-dialog` and `v-card`. Slideovers and bottom sheets share
  `ModalContent.vue` and `transitions.ts`, so `SlideoverContent.vue` and
  `constants.ts` have no counterpart.
- Config defaults are Vuetify classes, `fullscreen` is an extra config key
  (in `modalPropNames` and on `ModalLink`), and `useNativeDialog` is gone.
- Local additions: `title`, `beforeClose`, `dialogProps`, and `cardProps` on
  `Modal`, the `requestClose` slot prop, `ModalBtn`, `InertiaModal` Vuetify
  defaults, and the `getMaxWidth`/`getDialogLocation` exports.

## Last Sync

- Ported: the whole `vue/src` runtime at `e8a4d26`, replacing the
  `@inertiaui/modal-vue` dependency, plus upstream's `config`, `helpers`, and
  `modalStack` tests.
- Skipped: the React package, Tailwind markup, and upstream's docs site and CI.

## Verification

- [x] Commands in the skill's `references/upgrade-checklist.md` (e2e SSR test
  skipped locally; a modal URL was rendered through the SSR server instead)
- [x] Smoke list covered by the browser and e2e suites

## Residual Risk

- The two upstream bugs marked "Not reported upstream" above.
- Animation timing was only smoke-tested in a throttled automation browser.
