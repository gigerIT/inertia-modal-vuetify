# Upstream Upgrade Checklist

Use with `references/dependency-sync-procedure.md` for install/update commands
and `references/adapter-mirror-map.md` for file-level follow-up.

## Commit And Release Discovery

```sh
git ls-remote https://github.com/inertiaui/modal.git HEAD refs/heads/main
npm view @inertiaui/modal-vue version dist-tags repository --json
```

If upstream is cloned temporarily:

```sh
git -C "$TMP/modal" diff --stat <previous-upstream-commit>..<target-upstream-commit>
git -C "$TMP/modal" diff --name-status <previous-upstream-commit>..<target-upstream-commit>
git -C "$TMP/modal" log --oneline <previous-upstream-commit>..<target-upstream-commit>
```

Read upstream release notes, docs, and changelog for the same range when present.

## Upstream Files To Inspect

Priority files:

- `vue/package.json`
- `vue/src/HeadlessModal.vue`
- `vue/src/Modal.vue`
- `vue/src/ModalContent.vue`
- `vue/src/SlideoverContent.vue`
- `vue/src/CloseButton.vue`
- `vue/src/ModalLink.vue`
- `vue/src/config.js`
- `vue/src/inertiauiModal.js`
- `vue/src/modalStack.js`
- `vue/src/useModal.js`
- `vue/src/ModalRoot.vue`
- `vue/src/ModalRenderer.vue`
- `vue/src/Deferred.vue`
- `vue/src/WhenVisible.vue`
- root package metadata, Composer metadata, docs, and changelog

If package source paths differ, inspect installed `node_modules/@inertiaui/modal-vue`
and package exports to find equivalent files.

## Adapter Gap Checks

- Does upstream add a frontend feature or public behavior that the Vuetify adapter
  should expose?
- For each new upstream Vue frontend feature, report one decision to the user:
  implement now, defer, or skip. Include reason.
- If implementing a feature, create an adaptation plan before code edits:
  upstream behavior, adapter files, API/slots/emits/classes/accessibility,
  docs, tests, demo/browser verification, `dist`, and compatibility risks.
- Did `HeadlessModal` slot props, exposed methods, event names, or watcher
  behavior change?
- Did stack, local modal, nested modal, deferred prop, reload, or visit behavior
  change?
- Did close behavior change for Escape, backdrop, browser back, or explicit close?
- Did modal/slideover config defaults or accepted values change?
- Did upstream add CSS classes, ARIA behavior, focus handling, or transition
  timing that consumers may expect?
- Did `ModalLink` add props/events/options that must pass through?
- Did upstream change peer minimums for Vue, Inertia, Axios, Reka UI, or related
  runtime dependencies?

## Dependency And Metadata Checks

- Root `package.json` dependency on `@inertiaui/modal-vue` matches target.
- Root `peerDependencies` match real minimums required by upstream and Vuetify.
- `@inertiaui/modal-vue` remains in root `dependencies`, not `peerDependencies`
  only.
- `vite.config.js` continues to externalize `vue`, `vuetify`, `@inertiajs/vue3`,
  and `@inertiaui/modal-vue`.
- Demo app dependency versions align with root expectations.
- Demo Vite aliases avoid duplicate runtime instances.
- Lockfiles do not install duplicate Vue/Inertia/modal runtimes.
- Package exports still expose `dist` build and `./src` source entry as intended.
- `src/index.js` re-exports all supported upstream helpers and adapter helpers.

## Verification Commands

Run smallest relevant commands first, then expand for release-facing changes:

```sh
bun run build
bun run build:example
cd demo-app && npm run build
cd demo-app && npm run build:ssr
cd demo-app && npm run format:check
cd demo-app && composer run test
bun list --all | rg '@inertiaui/modal-vue|@inertiajs/vue3|vue@|vuetify'
npm pack --dry-run --json
git diff --check
```

When UI/lifecycle behavior changed, manually smoke:

- basic modal open/close
- backdrop close
- Escape close
- `closeExplicitly`
- browser back close behavior
- left and right slideovers
- nested/stacked modals
- scrim and `aria-hidden`
- focus/blur events
- `success` and `close` events
- reload/deferred props if upstream touched them
- SSR demo build if setup or rendering changed

## Package Artifact Checks

- `dist/inertia-modal-vuetify.es.js` and CJS output build without bundling
  duplicate Vue, Vuetify, Inertia, or upstream modal runtimes.
- `dist/index.d.ts` remains accurate when public exports changed.
- `npm pack --dry-run --json` includes expected publish files only.
- Example and demo still resolve the local adapter source for development.

## Docs And Tracker

Update docs when any of these change:

- install requirements
- public API, props, slots, emits, exposed methods
- styling classes or customization hooks
- modal/slideover config
- SSR setup
- troubleshooting or common mistakes

Update repo-root `UPSTREAM.md` after verification passes. Use
`references/upstream-tracker-template.md`.

## Release And Version Notes

- Adapter semver is independent from upstream `@inertiaui/modal-vue`.
- Release Please owns adapter version bumps/changelog unless the user explicitly
  requests a release task.
- Record upstream version/commit and adapter impact in `UPSTREAM.md`.
