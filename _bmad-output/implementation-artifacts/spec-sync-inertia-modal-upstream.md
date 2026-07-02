---
title: 'Sync adapter with upstream InertiaUI Modal'
type: 'chore'
created: '2026-07-02'
status: 'done'
baseline_commit: '4787f646c7eafd975ace2a171f3512d338bd2029'
context:
  - '{project-root}/_bmad-output/project-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The adapter already resolves `@inertiaui/modal-vue` 3.1.2, but it has not recorded an upstream sync and still misses parts of the current v3 public/runtime contract. This can make the package less drop-in than advertised and leaves packaging/docs stale.

**Approach:** Compare against upstream `inertiaui/modal` branch `3.x` at `0d003eef88a0303a7fba272d3fa428261ec4f1b0` and npm `@inertiaui/modal-vue@3.1.2`, then port only Vuetify-compatible presentation/runtime parity gaps. Keep upstream modal routing, stack, local modal behavior, deferred props, and navigation inside the external dependency.

## Boundaries & Constraints

**Always:** Keep Vue, Vuetify, Inertia, and `@inertiaui/modal-vue` external in the root build. Preserve existing `Modal`, `ModalLink`, slot props, events, exposed methods, `closeExplicitly`, stacked modal behavior, and `im-` CSS hooks. Preserve unrelated worktree changes, including untracked investigation files.

**Ask First:** Halt if parity requires redesigning public adapter behavior, implementing upstream modal state locally, changing adapter semver/release-please files, editing Composer/backend dependencies, or working around a `gigerit` dependency bug.

**Never:** Do not vendor upstream source, patch `node_modules`, reimplement upstream routing/stack/lifecycle internals, remove public exports, or replace Vuetify presentation with upstream Tailwind/native-dialog markup.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Upstream target discovery | npm latest is 3.1.2 and upstream branch `3.x` is one changelog commit ahead | `UPSTREAM.md` records package 3.1.2 plus commit `0d003eef88a0303a7fba272d3fa428261ec4f1b0` | If target source changes during work, re-run discovery and record exact new target |
| Runtime exports | Consumer imports current upstream v3 helpers through this adapter | `src/index.js` re-exports supported v3 runtime helpers such as `prefetch`, `modalPropNames`, `ModalInstance`, and `dialogUtils` when available | If an export is absent from installed v3, do not invent a shim; document skipped export |
| Close behavior | `close-on-click-outside="false"` or config disables outside close | Vuetify dialog respects the upstream config by preventing outside close while preserving `closeExplicitly` semantics | If Vuetify cannot express the exact behavior, use the smallest adapter-level guard around `setOpen` |
| Packaging types | Consumer resolves package `types` entry | `dist/index.d.ts` exists and describes adapter exports without bundling upstream types | If full upstream type re-export is not available, provide accurate minimal declarations for adapter-owned exports and pass-through runtime exports |

</frozen-after-approval>

## Code Map

- `package.json` -- Published dependency, peer, types, and files metadata.
- `bun.lock` -- Root lock proving npm latest `@inertiaui/modal-vue@3.1.2` and `@inertiaui/vanilla` runtime.
- `vite.config.js` -- Library externals; must continue excluding upstream runtime.
- `src/index.js` -- Adapter public export surface mirroring upstream v3 helpers.
- `src/Modal.vue` -- Vuetify `v-dialog` wrapper, close policy, stack attrs, scrim, and lifecycle hooks.
- `src/ModalContent.vue` -- Centered modal content, close button, padding/panel classes, transition cleanup.
- `src/SlideoverContent.vue` -- Slideover content, width, close button, transition cleanup.
- `src/config.js` -- Vuetify width/location helpers; do not replace upstream config ownership.
- `dist/index.d.ts` -- Tracked type entry required by `package.json`.
- `README.md` and `docs/*.md` -- Consumer-facing setup/API docs that mention peer versions or upstream imports.
- `UPSTREAM.md` -- Upstream tracker to create after verification passes.

## Tasks & Acceptance

**Execution:**
- [x] `src/index.js` -- Add missing current v3 pass-through exports that exist in installed `@inertiaui/modal-vue` -- consumers can import upstream helpers through the adapter.
- [x] `src/Modal.vue` -- Port Vuetify-compatible v3 behavior for scroll lock / `aria-hidden` cleanup and close-on-click-outside policy without replacing `v-dialog` presentation -- adapter matches upstream public behavior while retaining Vuetify UI.
- [x] `src/ModalContent.vue` and `src/SlideoverContent.vue` -- Remove dead close handlers/imports only if touched by close-policy work -- keep transition `afterLeave` timing unchanged.
- [x] `dist/index.d.ts` -- Add/update the tracked declaration file for the package `types` entry -- `npm pack` includes a valid type artifact.
- [x] `README.md` and focused `docs/*.md` -- Correct stale Inertia/Vuetify/upstream import references that directly conflict with current package metadata -- docs match installation/runtime reality.
- [x] `UPSTREAM.md` -- Record upstream repository, synced commit, npm package version, adapter changes, verification, and residual risk after checks pass.
- [x] Verification commands -- Run root build, example build, dependency inspection, pack dry-run, and diff checks; run demo build if source/docs changes affect integration.

**Acceptance Criteria:**
- Given the adapter source is built, when `bun run build` runs, then ESM/CJS output compiles with `@inertiaui/modal-vue` externalized and without missing export errors.
- Given the example app builds, when `bun run build:example` runs, then local source aliases compile against the same upstream v3 dependency graph.
- Given package metadata is packed, when `npm pack --dry-run --json` runs, then the tarball includes `dist/index.d.ts` and expected package/source files only.
- Given dependencies are inspected, when `bun list --all | rg '@inertiaui/modal-vue|@inertiajs/vue3|vue@|vuetify'` runs, then there is no duplicate modal, Inertia, Vue, or Vuetify runtime that would break injection/state.
- Given upstream tracker is read, when `UPSTREAM.md` is inspected, then it records npm `3.1.2`, upstream commit `0d003eef88a0303a7fba272d3fa428261ec4f1b0`, verification results, and any manual-smoke residual risk.

## Spec Change Log

## Design Notes

Upstream branch `3.x` is one changelog-only commit ahead of npm tag `3.1.2`, so dependency ranges do not need bumping. New user-facing/public v3 behavior found during planning: `ModalLink` prefetch support already passes through because the local wrapper forwards attrs; `prefetch`, `modalPropNames`, `ModalInstance`, and `dialogUtils` should be implemented now as pass-through exports; native dialog mode should be skipped because this adapter intentionally renders through Vuetify `v-dialog`; scroll lock / app `aria-hidden` cleanup should be implemented now using upstream `@inertiaui/vanilla` helpers; `closeOnClickOutside` should be implemented now in the Vuetify close guard; docs cleanup should be focused rather than wholesale upstream docs rewrite.

## Verification

**Commands:**
- `bun run build` -- expected: library build succeeds.
- `bun run build:example` -- expected: example build succeeds.
- `cd demo-app && npm run build` -- expected: demo frontend build succeeds if integration-facing source changed.
- `bun list --all | rg '@inertiaui/modal-vue|@inertiajs/vue3|vue@|vuetify'` -- expected: no duplicate runtime graph.
- `npm pack --dry-run --json` -- expected: includes valid `dist/index.d.ts` and expected files.
- `git diff --check` -- expected: no whitespace errors.

## Suggested Review Order

**Adapter Runtime**

- Main sync logic: lifecycle cleanup, outside-click guard, and prop forwarding.
  [`Modal.vue:48`](../../src/Modal.vue#L48)

- Consumer route props stay forwarded through the Vuetify content wrapper.
  [`Modal.vue:166`](../../src/Modal.vue#L166)

- Upstream `loading` slot prop survives the local wrapper.
  [`ModalLink.vue:12`](../../src/ModalLink.vue#L12)

- New upstream v3 helpers pass through public adapter exports.
  [`index.js:2`](../../src/index.js#L2)

**Packaging**

- Runtime dependencies and export condition order match current package graph.
  [`package.json:17`](../../package.json#L17)

- Build keeps runtimes external and emits the package type entry.
  [`vite.config.js:5`](../../vite.config.js#L5)

- Published type artifact mirrors adapter and upstream public exports.
  [`index.d.ts:1`](../../dist/index.d.ts#L1)

**Docs And Tracker**

- Upstream target, verification, and residual risks are recorded.
  [`UPSTREAM.md:1`](../../UPSTREAM.md#L1)

- Installation docs now point consumers at the Vuetify adapter.
  [`installation.md:1`](../../docs/installation.md#L1)

- CJS upstream compatibility risk is deferred separately.
  [`deferred-work.md:1`](deferred-work.md#L1)
