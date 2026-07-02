---
title: 'Upgrade package to Vuetify 4'
type: 'feature'
created: '2026-07-02'
status: 'in-review'
baseline_commit: 'c7bf2226827c35264cf383f9fa16b6a5c23fd227'
context: []
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The package currently advertises and tests against Vuetify 3, while Vuetify 4 is now the current stable release. Consumers installing this adapter with Vuetify 4 need compatible peer metadata, examples, docs, and verified runtime/build behavior.

**Approach:** Upgrade the root package, standalone example, and Laravel demo dependency declarations/locks to Vuetify 4, then adjust source only where Vuetify 4 actually requires API changes. Preserve the adapter's upstream `@inertiaui/modal-vue` API surface and Vuetify presentation behavior.

## Boundaries & Constraints

**Always:** Keep Vue, Vuetify, Inertia, and `@inertiaui/modal-vue` external in the library build. Preserve public exports, slot props, events, exposed methods, and `im-` CSS hooks. Preserve `closeExplicitly` behavior for backdrop, Escape, and browser-back closure. Treat `false` as meaningful for close-button and class config. Keep teleport layout overrides global. Keep lockfiles synchronized with manifest changes.

**Ask First:** Halt before dropping support for any non-Vuetify-4 consumer path beyond the peer dependency major bump. Halt if Vuetify 4 requires a material public API change, a local workaround for `@inertiaui/modal-vue`, or a workaround for a `gigerit`-owned dependency. Halt before editing generated `dist/` output or release-please files.

**Never:** Do not reimplement upstream modal state/navigation/lifecycle behavior. Do not bundle Vuetify into published output. Do not add custom shims for Vuetify 4 if the documented component API or installed source supports the current adapter shape. Do not make unrelated style, formatting, or demo feature changes.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Install metadata | Consumer installs package in a Vuetify 4 app | `package.json` peer dependency accepts Vuetify 4 and Vue version required by Vuetify 4 | If peer conflicts appear, update the smallest compatible dependency range or halt if conflict is upstream-owned |
| Library build | Root package builds after dependency upgrade | ESM/CJS bundles compile with Vuetify externalized | Fix source/import incompatibilities only within adapter files |
| Example build | Standalone Vite example builds against root dependencies | Example compiles and resolves Vuetify 4 components/directives/styles | Fix documented Vuetify setup/import changes only |
| Demo build | Laravel/Inertia demo builds against its own deps | Demo compiles with alias to `src/index.js` and Vuetify 4 | Update demo manifest and npm/Bun locks consistently |
| Modal behavior surface | Existing modal/slideover props/config are used | Centered modal, slideover, scrim, persistent, close button, and transition cleanup remain wired through existing public API | If a behavior cannot be verified by build, document manual check needed |

</frozen-after-approval>

## Code Map

- `package.json` -- Published peer/dev dependency metadata and root scripts for library/example builds.
- `bun.lock` -- Root Bun lockfile for package and standalone example dependencies.
- `src/Modal.vue` -- Vuetify `v-dialog` integration, stack/scrim/persistent/back behavior, global slideover overlay selectors.
- `src/ModalContent.vue` -- Centered modal `v-card`, transition cleanup, close-button/padding/panel config.
- `src/SlideoverContent.vue` -- Slideover `v-card`, Vuetify slide transition imports, width and lifecycle cleanup.
- `src/CloseButton.vue` -- Vuetify `v-btn`/`v-icon` close control injected from modal context.
- `example/main.js` and `example/vite.config.js` -- Standalone Vuetify plugin setup and Vite Vuetify plugin usage.
- `demo-app/package.json` -- Demo app dependency declarations using local package alias.
- `demo-app/package-lock.json` and `demo-app/bun.lock` -- Demo npm/Bun lockfiles that must reflect Vuetify 4 dependency graph.
- `demo-app/resources/js/app.ts` and `demo-app/vite.config.ts` -- Demo Vuetify app setup and source alias.
- `README.md` and `docs/*.md` -- User-facing version/support references that currently mention Vuetify 3.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- Change published peer metadata to Vuetify 4 and Vue range compatible with Vuetify 4; update root dev dependency to current Vuetify 4 and any required Vuetify plugin patch -- consumers get correct install constraints.
- [x] `bun.lock` -- Refresh root lock after manifest changes -- root build/example use Vuetify 4.
- [x] `src/Modal.vue`, `src/ModalContent.vue`, `src/SlideoverContent.vue`, `src/CloseButton.vue`, `src/config.js` -- Check Vuetify 4 component props/imports against installed source and make only required compatibility edits -- modal behavior remains adapter-owned presentation only.
- [x] `demo-app/package.json`, `demo-app/package-lock.json`, `demo-app/bun.lock` -- Upgrade demo Vuetify dependency graph consistently -- integration demo tests the same major version.
- [x] `example/main.js`, `example/vite.config.js`, `demo-app/resources/js/app.ts`, `demo-app/vite.config.ts` -- Update only if Vuetify 4 setup/plugin usage changed or build fails -- avoid churn when current setup remains valid.
- [x] `README.md`, `docs/*.md` -- Replace Vuetify 3 support/install references with Vuetify 4-accurate language -- public docs match package metadata.

**Acceptance Criteria:**
- Given the root package manifest, when a consumer installs this package, then peer dependencies require Vuetify 4 and a Vue range compatible with Vuetify 4.
- Given the root build runs, when `bun run build` completes, then library output compiles without bundling Vue, Vuetify, Inertia, or `@inertiaui/modal-vue`.
- Given the standalone example builds, when `bun run build:example` completes, then Vuetify 4 components, directives, styles, and plugin integration resolve successfully.
- Given the demo app builds, when its frontend build completes, then the local package alias compiles against Vuetify 4.
- Given source review after upgrade, when modal/slideover components are inspected, then existing public adapter behavior is preserved or any required manual verification is explicitly reported.

## Spec Change Log

## Design Notes

Vuetify 4.1.2 is the current `latest` npm dist-tag during planning. Its peer metadata requires Vue `^3.5.0` and `vite-plugin-vuetify >=2.1.0`; `vite-plugin-vuetify` 2.1.3 advertises `vuetify >=3`, so a patch update is enough unless installed-source/build verification proves otherwise. Context7's Vuetify 4 docs are sparse, so validate concrete component props/imports through installed package source after dependency update.

## Verification

**Commands:**
- `bun install` -- expected: root `bun.lock` updates and dependency resolution succeeds.
- `bun run build` -- expected: library ESM/CJS build succeeds.
- `bun run build:example` -- expected: standalone example Vite build succeeds.
- `cd demo-app && npm install` -- expected: `package-lock.json` resolves Vuetify 4 without peer conflicts.
- `cd demo-app && bun install` -- expected: `bun.lock` resolves Vuetify 4 consistently.
- `cd demo-app && npm run build` -- expected: Laravel/Inertia frontend build succeeds.
