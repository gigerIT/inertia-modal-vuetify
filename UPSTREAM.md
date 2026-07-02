# Upstream Tracker

Last verified sync for this adapter against `inertiaui/modal`.

## Source

- Repository: https://github.com/inertiaui/modal.git
- Branch: 3.x
- Synced commit: `0d003eef88a0303a7fba272d3fa428261ec4f1b0`
- Synced commit title: `Update CHANGELOG`
- Synced at: `2026-07-02`

## Upstream Vue Package

- Package: `@inertiaui/modal-vue`
- Version: `3.1.2`
- Install source: npm package

## Adapter Changes Required

- `src/index.js` now re-exports current upstream v3 helpers: `prefetch`, `modalPropNames`, `ModalInstance`, and `dialogUtils`.
- `src/Modal.vue` mirrors upstream scroll lock and `appElement` `aria-hidden` lifecycle with `@inertiaui/vanilla`.
- `src/Modal.vue` respects `closeOnClickOutside: false` for Vuetify dialog backdrop clicks while preserving `closeExplicitly`.
- `vite.config.js` emits `dist/index.d.ts` during builds and keeps `vuetify/components` plus `@inertiaui/vanilla` external.
- `package.json` declares direct `@inertiaui/vanilla` usage and fixes export condition ordering for `types`.

## Demo And Docs Changes

- `README.md` documents Inertia Vue 3 peer requirements, `close-on-click-outside`, and `ModalLink` prefetch props.
- Focused docs now use `@gigerit/inertia-modal-vuetify` for Vue imports and remove stale Tailwind installation/styling guidance.

## Verification

- [x] `bun run build`
- [x] `bun run build:example`
- [x] `cd demo-app && npm run build`
- [ ] `cd demo-app && npm run build:ssr`
- [ ] `cd demo-app && npm run format:check`
- [ ] `cd demo-app && composer run test`
- [x] `bun list --all | rg '@inertiaui/modal-vue|@inertiajs/vue3|vue@|vuetify'`
- [x] `npm pack --dry-run --json`
- [x] Type smoke for `dist/index.d.ts` with `tsc --noEmit`
- [ ] Manual smoke completed when UI behavior changed

## Residual Risk

- Manual browser smoke was not run for backdrop close, Escape close, browser-back close, nested stacks, focus/blur, and transition cleanup.
- Demo SSR, formatting, and backend tests were not run in this sync pass.
- CommonJS `require()` remains incompatible with upstream `@inertiaui/modal-vue@3.1.2` because its CJS bundle requires ESM-only `@inertiaui/vanilla`; tracked in `_bmad-output/implementation-artifacts/deferred-work.md`.
