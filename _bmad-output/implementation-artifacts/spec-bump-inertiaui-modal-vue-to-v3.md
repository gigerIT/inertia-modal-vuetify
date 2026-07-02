---
title: 'Bump @inertiaui/modal-vue to v3'
type: 'chore'
created: '2026-07-02'
status: 'done'
baseline_commit: '075a3049576755530f4e5b39083b0dfdece624a3'
context:
  - '{project-root}/_bmad-output/project-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The package still depends on `@inertiaui/modal-vue` beta 1.x while the requested target is v3. Keeping the old dependency leaves consumers and the demo app on an obsolete upstream modal runtime.

**Approach:** Upgrade the root package and demo app to the current v3 range for `@inertiaui/modal-vue`, align Inertia Vue peer/dependency constraints required by upstream v3, refresh lockfiles, and verify the adapter still builds against the v3 exports.

## Boundaries & Constraints

**Always:** Keep `@inertiaui/modal-vue` external in the library build. Preserve existing public exports and the Vuetify adapter API unless v3 removed an upstream export. Keep unrelated user/agent worktree changes untouched.

**Ask First:** If v3 removes or changes an upstream API used by `src/index.js`, `src/Modal.vue`, or `src/ModalLink.vue` in a way that requires redesigning adapter behavior, stop and ask before changing public surface. If the Laravel demo backend must be upgraded beyond frontend package constraints, stop and ask before touching PHP/composer files.

**Never:** Do not patch upstream package internals, duplicate upstream modal state/navigation logic, or add local compatibility shims for removed v3 behavior without explicit approval.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Root dependency upgrade | Root manifest references `@inertiaui/modal-vue` beta 1.x | Root manifest and `bun.lock` resolve `@inertiaui/modal-vue` v3, with compatible `@inertiajs/vue3` peer range | If install fails from peer conflict, align root peer/dev constraints rather than forcing install |
| Demo dependency upgrade | Demo app references beta 1.x and Inertia Vue v2 | Demo package manifests and lockfiles resolve upstream modal v3 with compatible Inertia Vue v3 | If frontend build exposes backend/runtime incompatibility, report exact blocker before touching PHP backend |
| Adapter export compatibility | Source re-exports upstream modal utilities/components | Build succeeds and existing exports remain present where v3 still provides them | If an export is absent in v3, stop before removing or renaming public exports |

</frozen-after-approval>

## Code Map

- `package.json` -- Root package dependency and peer compatibility contract.
- `bun.lock` -- Root Bun lockfile that must match package manifest changes.
- `demo-app/package.json` -- Demo frontend dependencies for integration verification.
- `demo-app/bun.lock` -- Demo Bun lockfile; keep synced with demo dependency updates.
- `demo-app/package-lock.json` -- Existing npm lockfile; keep synced if dependency graph changes.
- `src/index.js` -- Public re-export surface for upstream modal utilities/components.
- `src/Modal.vue` -- Vuetify adapter around upstream `HeadlessModal`.
- `src/ModalLink.vue` -- Thin wrapper around upstream `ModalLink`.
- `vite.config.js` -- Externalizes `@inertiaui/modal-vue` and `@inertiajs/vue3` during library build.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` -- Update `@inertiaui/modal-vue` to v3 and align `@inertiajs/vue3` peer compatibility with upstream v3 requirements.
- [x] `demo-app/package.json` -- Update demo `@inertiaui/modal-vue` and `@inertiajs/vue3` dependency ranges to compatible v3 versions.
- [x] `bun.lock`, `demo-app/bun.lock`, `demo-app/package-lock.json` -- Refresh lockfiles from the updated manifests without editing unrelated generated content by hand.
- [x] `src/index.js`, `src/Modal.vue`, `src/ModalLink.vue` -- Verify imported/re-exported v3 APIs still exist; make only required compatibility edits.
- [x] Build commands -- Run package and relevant frontend builds to catch dependency/API regressions.

**Acceptance Criteria:**
- Given root dependencies are installed, when `bun run build` runs, then the library build completes with `@inertiaui/modal-vue` externalized and no missing upstream export errors.
- Given example app dependencies are available, when `bun run build:example` runs, then the Vite example builds against the v3 dependency graph.
- Given demo frontend dependencies are installed, when `cd demo-app && npm run build` runs, then the demo frontend build completes or reports a concrete v3/backend compatibility blocker.
- Given manifests are inspected, when dependency ranges are checked, then no package in this repo still requests `@inertiaui/modal-vue` beta 1.x.

## Spec Change Log

## Design Notes

Registry and v3 package inspection show `@inertiaui/modal-vue@3.1.2` peers on `@inertiajs/vue3 ^3.0.0` and `vue ^3.4.x`, and still exports `HeadlessModal`, `ModalLink`, `ModalRoot`, `renderApp`, `withInertiaModal`, `getConfig`, `putConfig`, `resetConfig`, `useModal`, `useModalStack`, `visitModal`, `Deferred`, and `WhenVisible`. The implementation should prefer dependency/peer alignment over adapter behavior changes.

## Verification

**Commands:**
- `bun install` -- expected: root manifest and `bun.lock` resolve modal v3 without peer conflicts.
- `bun run build` -- expected: library build succeeds.
- `bun run build:example` -- expected: example app build succeeds.
- `cd demo-app && bun install` -- expected: demo `bun.lock` resolves modal v3 and Inertia Vue v3.
- `cd demo-app && npm install --package-lock-only` -- expected: demo npm lockfile matches updated manifest.
- `cd demo-app && npm run build` -- expected: demo frontend build succeeds or gives a concrete compatibility blocker.

## Suggested Review Order

**Root Package Contract**

- Root peer/runtime ranges align package with upstream modal v3.
  [`package.json:31`](../../package.json#L31)

- Lockfile proves root install resolves modal v3 and Inertia Vue v3.
  [`bun.lock:6`](../../bun.lock#L6)

**Public API Surface**

- New upstream v3 setup helper is passed through without adapter behavior changes.
  [`index.js:2`](../../src/index.js#L2)

**Demo Integration**

- Demo now consumes direct v3 dependencies while Vite aliases local source.
  [`package.json:26`](../../demo-app/package.json#L26)

- Existing alias keeps demo testing local adapter source, not a copied package.
  [`vite.config.ts:28`](../../demo-app/vite.config.ts#L28)

- Bun demo lock resolves v3 dependencies without local file-package copying.
  [`bun.lock:6`](../../demo-app/bun.lock#L6)

- npm demo lock mirrors the same v3 dependency graph.
  [`package-lock.json:6`](../../demo-app/package-lock.json#L6)
