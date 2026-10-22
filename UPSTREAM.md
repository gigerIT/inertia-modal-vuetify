# Upstream Tracker

Last verified sync for this adapter against `inertiaui/modal`.

## Source

- Repository: https://github.com/inertiaui/modal.git
- Branch: 3.x
- Synced commit: `e8a4d2672bb67051177add51ac58ee82176330e5`
- Synced commit title: `Navbar`
- Synced at: `2026-10-22`

## Upstream Vue Package

- Package: `@inertiaui/modal-vue`
- Version: `3.1.2`
- Install source: npm package

## Adapter Changes Required

- None from upstream: the 20 commits since `0d003ee` only touch docs and CI.
- Adapter rewrite in the same pass (not upstream-driven):
  - `src/ModalContent.vue` renders both variants with one `v-dialog`, calls
    `afterLeave` from the dialog's `after-leave`, and replaces the removed
    `src/SlideoverContent.vue`.
  - `src/ModalLink.vue` removed; `ModalLink` is re-exported from upstream.
  - `src/config.js` wraps `putConfig`/`resetConfig` so upstream's Tailwind
    `paddingClasses`/`panelClasses` defaults never reach Vuetify.
  - Vuetify's dialog scroll blocking replaces upstream's `lockScroll`.

## Demo And Docs Changes

- Demo moved to Laravel 13, `inertiajs/inertia-laravel` 3, and
  `inertiaui/modal` 3.1; pages cover every modal variant.
- Docs dropped React snippets and document SSR, widths, and Vuetify defaults.

## Verification

- [x] `bun run test`
- [x] `bun run build`
- [x] `bun run build:example`
- [x] `cd demo-app && npm run build`
- [x] `cd demo-app && npm run build:ssr` (SSR render of a routed modal checked)
- [x] `cd demo-app && npm run format:check`
- [x] `cd demo-app && npm run typecheck`
- [x] `cd demo-app && composer run test`
- [x] `bun list --all | rg '@inertiaui/modal-vue|@inertiajs/vue3|vue@|vuetify'`
- [x] `npm pack --dry-run --json`
- [x] Manual smoke completed when UI behavior changed

## Residual Risk

- Upstream: reopening the same local modal while it is still leaving swaps
  `HeadlessModal`'s context, so the old stack entry never gets `afterLeave`
  and later modals get ever-growing indexes.
- Upstream: in non-navigate mode, a form that redirects back to the base URL
  does not close the modal, because Inertia 3 replaces same-URL visits without
  firing `navigate`. Close explicitly in `onSuccess`.
- Upstream: `renderApp` is typed for Inertia 2 props; `src/index.d.ts`
  overrides it until upstream fixes the declaration.
- Animation timing was only smoke-tested in a throttled automation browser.
