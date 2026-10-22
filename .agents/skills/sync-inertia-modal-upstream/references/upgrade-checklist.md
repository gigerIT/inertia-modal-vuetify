# Upgrade Checklist

Gap checks, metadata checks, and verification for a sync. File locations are
in `adapter-mirror-map.md`.

## Gap Checks

- Did the Laravel package change a header, the `_inertiaui_modal` prop, the
  response shape, redirects, or base-route rendering?
- Did `HeadlessModal` slot props, exposed methods, events, or watchers change?
- Did stack, local modal, nested modal, deferred prop, prefetch, reload, or
  visit behavior change?
- Did close behavior change for Escape, backdrop, browser back, redirects, or
  `closeExplicitly`?
- Did config keys, defaults, or accepted values change?
- Did `ModalLink` gain props, events, or prefetch options?
- Did upstream add ARIA, focus, or transition behavior consumers may expect?
- Did upstream fix something listed as a divergence in `UPSTREAM.md`?
- Did `vue/package.json` change `@inertiaui/vanilla`, Inertia, or Vue ranges?

## Metadata Checks

- `@inertiaui/vanilla` matches upstream's range in root and demo
  `package.json`.
- No `@inertiaui/modal-vue` in any `package.json` or lockfile.
- `vite.config.ts` keeps `vue`, `vuetify`, `@inertiajs/*`, and
  `@inertiaui/vanilla` external.
- Demo `resolve.dedupe` covers the same packages, and lockfiles hold one copy
  of each runtime.
- `src/index.ts` exports every upstream export name.

## Verification Commands

```sh
bun run lint
bun run format:check
bun run typecheck
bun run test
bun run build
bun run build:example
npm pack --dry-run --json
git diff --check
cd demo-app
npm run lint:test
npm run format:check
npm run typecheck
npm run build
npm run build:ssr
composer run test
npm run test:e2e
```

## Manual Smoke

When behavior changed, check in the demo app:

- open and close through the close button, Escape, and the backdrop
- `closeExplicitly` and `before-close`
- navigate mode with browser back
- slideovers (left, right) and the bottom sheet
- nested modals: scrim, `aria-hidden`, focus/blur, events to the parent
- a form that redirects back closes the modal
- deferred props, reload, and prefetching
- a direct modal URL with SSR

## Release Notes

- Package semver is independent of upstream; Release Please owns versions and
  the changelog.
- Consumer-visible behavior changes from a port need a Conventional Commit
  type that reaches the changelog (`feat`, `fix`, or `!`).
