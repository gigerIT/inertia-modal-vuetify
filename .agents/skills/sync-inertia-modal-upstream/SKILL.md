---
name: sync-inertia-modal-upstream
description: Use when syncing this Vuetify adapter with upstream inertiaui/modal or @inertiaui/modal-vue, comparing upstream commits/releases, updating package metadata, lockfiles, adapter compatibility, dist artifacts, docs, demo/example apps, or the root upstream tracker.
---

# Sync Inertia Modal Upstream

## Overview

Synchronize this adapter with the upstream InertiaUI Modal Vue package without
losing local Vuetify adapter contracts. Upstream owns modal routing, stack,
lifecycle, local modals, deferred props, and headless behavior; this repo adapts
the presentation layer to Vuetify.

## Required Reading

1. `AGENTS.md` - dependency rules, build commands, core contracts.
2. Repo-root `UPSTREAM.md` if present - previous synced baseline.
3. `references/dependency-sync-procedure.md` - exact dependency update flow.
4. `references/adapter-mirror-map.md` - upstream files to diff against adapter files.
5. `references/upgrade-checklist.md` - verification and metadata gates.
6. `references/upstream-tracker-template.md` - create/update `UPSTREAM.md` after success.

## Architecture To Preserve

- Upstream repo: `https://github.com/inertiaui/modal.git`.
- Upstream package: `@inertiaui/modal-vue`.
- Root package publishes `@gigerit/inertia-modal-vuetify`.
- Root build keeps Vue, Vuetify, Inertia, and `@inertiaui/modal-vue` external.
- This adapter does not vendor upstream source. Sync by upgrading dependency
  constraints/lockfiles and porting only needed Vuetify presentation changes.
- `src/index.js` re-exports upstream helpers and exports adapter components.
- `src/Modal.vue` wraps upstream `HeadlessModal` with Vuetify `v-dialog`.
- `src/ModalContent.vue`, `src/SlideoverContent.vue`, and `src/CloseButton.vue`
  replace upstream Tailwind/Reka presentation with Vuetify components.
- `ModalLink.vue` forwards to upstream `ModalLink`; preserve attribute/slot pass-through.

## Workflow

### 1. Capture baseline

```sh
git status --short --branch
git remote -v
```

Read:

- repo-root `UPSTREAM.md` if present
- root `package.json`, `bun.lock`, `vite.config.js`
- `src/index.js`, `src/Modal.vue`, content components, and `src/config.js`
- `example/**` package/demo files
- `demo-app/package.json`, lockfile, `vite.config.ts`, Composer files

Preserve unrelated dirty files.

### 2. Resolve upstream target

- Default repo: `https://github.com/inertiaui/modal.git`
- Default branch: `main`
- Default package: `@inertiaui/modal-vue`
- If the user supplied a version, tag, branch, or commit, use that exact target.
- Otherwise compare installed package/lockfile version to latest npm package and
  upstream `main`.

Inspect delta before editing:

```sh
git ls-remote https://github.com/inertiaui/modal.git HEAD refs/heads/main
npm view @inertiaui/modal-vue version dist-tags repository --json
```

Use a temporary clone or `git show` outside this repo for upstream diffs. Do not
turn any dependency folder into a nested git repo.

### 3. Refresh dependency and lockfiles

Follow `references/dependency-sync-procedure.md`.

Update only required package constraints and lockfiles. Keep:

- root `@inertiaui/modal-vue` as a runtime dependency, not bundled source
- root Vite external for `@inertiaui/modal-vue`
- root peer dependency ranges aligned with real runtime requirements
- demo app alias for local adapter source
- demo app upstream modal resolution free of duplicate Inertia/modal runtimes

### 4. Assess upstream Vue features and port adapter changes

Use `references/adapter-mirror-map.md` to decide what needs manual porting.

Before implementing, explicitly report upstream Vue frontend changes that look
like new user-facing features or expanded public behavior. For each feature,
state whether the Vuetify adapter should implement it now, defer it, or skip it.

If a feature should be implemented in the Vuetify adapter, create a focused
adaptation plan before editing adapter code. Cover:

- upstream source files and behavior to mirror
- affected adapter files
- public API, slots, emits, styling, classes, accessibility, transitions, and docs
- root/example/demo package metadata impact
- build, demo, browser smoke, and generated `dist` impact
- rollout risks and compatibility notes

Prefer edits in:

- `src/`
- `docs/`
- `example/`
- `demo-app/`
- root/demo package metadata and lockfiles

Do not reimplement upstream modal routing, stack, local modal registration,
deferred props, or lifecycle behavior locally unless upstream explicitly removed
the hook this adapter depends on and the user approves the design.

### 5. Regenerate and verify

Minimum root verification:

```sh
bun run build
```

Then run relevant commands from `references/upgrade-checklist.md`, especially
when package metadata, UI behavior, or demos changed.

Inspect:

- `bun list --all | rg '@inertiaui/modal-vue|@inertiajs/vue3|vue@|vuetify'`
- `npm pack --dry-run --json`
- generated `dist/**` when build output is part of the requested sync

### 6. Update tracker and docs

After verification passes:

- Create or update repo-root `UPSTREAM.md` from
  `references/upstream-tracker-template.md`.
- Update docs when consumer-visible setup, props, slots, emits, styling hooks, or
  troubleshooting changed.
- Update `AGENTS.md` only for durable repo rules.
- Update upgrade notes only for breaking consumer migration decisions.

### 7. Final review

```sh
git diff --check
git status --short --branch
```

Report:

- upstream target synced
- adapter files changed and why
- verification commands run and results
- residual risk or follow-up work

## Stop Conditions

- If a bug/gap is in a `gigerit`-owned dependency and blocks the task, follow the
  repository dependency rule: do not workaround in the consuming project unless
  the user explicitly approves.
- If unrelated dirty files overlap with required edits, preserve them and make the
  smallest compatible change.
- If upstream introduces breaking contracts without enough context, stop and
  report exact missing decision points.
- If duplicate Vue, Inertia, Vuetify, or modal runtimes appear after install,
  fix dependency metadata/resolution before claiming the sync complete.

## Quick Reference

| Topic | Reference |
| --- | --- |
| Dependency update commands and lockfiles | `references/dependency-sync-procedure.md` |
| Upstream file -> adapter file mapping | `references/adapter-mirror-map.md` |
| Verification, metadata, docs | `references/upgrade-checklist.md` |
| `UPSTREAM.md` format | `references/upstream-tracker-template.md` |
