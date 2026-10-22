---
name: sync-inertia-modal-upstream
description: Use when checking upstream inertiaui/modal (the Laravel package or @inertiaui/modal-vue) for new commits or releases, porting its fixes, features, or wire-protocol changes into this package's runtime, or updating UPSTREAM.md.
---

# Sync Inertia Modal Upstream

## Overview

`src/` owns a TypeScript port of `@inertiaui/modal-vue`'s runtime and talks to
the `inertiaui/modal` Laravel package over its wire protocol. Syncing means
reviewing every upstream commit since the one recorded in `UPSTREAM.md` and
porting what applies: protocol changes always, runtime fixes and features by
decision, Tailwind presentation only as behavior. Nothing is installed from
upstream except `@inertiaui/vanilla`.

## Required Reading

1. `AGENTS.md` - guardrails (wire protocol, public API, Vuetify contracts).
2. `UPSTREAM.md` - synced commit and the divergences to keep.
3. `references/adapter-mirror-map.md` - upstream file -> local file.
4. `references/upgrade-checklist.md` - gap checks, verification, metadata.
5. `references/upstream-tracker-template.md` - `UPSTREAM.md` format.

## Workflow

### 1. Resolve the range

```sh
git status --short --branch
git ls-remote --symref https://github.com/inertiaui/modal.git HEAD
gh release list -R inertiaui/modal --limit 5
npm view @inertiaui/modal-vue version
```

The range starts at `UPSTREAM.md`'s synced commit and ends at the user's
target, or upstream `HEAD` (branch `3.x`; there is no `main`). Clone outside
the repo:

```sh
TMP="$(mktemp -d)"
git clone https://github.com/inertiaui/modal.git "$TMP/modal"
git -C "$TMP/modal" checkout <target>
git -C "$TMP/modal" log --oneline <synced>..<target>
git -C "$TMP/modal" diff --stat <synced>..<target>
```

### 2. Triage every commit

Classify each commit in the range with the mirror map:

- **Protocol** - Laravel `src/*.php`: headers, the `_inertiaui_modal` prop,
  the modal response shape, redirects. Port: the demo runs the Laravel package
  at the target version, so a missed change breaks it.
- **Runtime** - ported `vue/src` files. Port unless a divergence in
  `UPSTREAM.md` already covers it.
- **Presentation** - upstream's Tailwind components. Port the behavior into
  the Vuetify components; skip class and markup changes.
- **Docs** - adapt to `docs/` when the behavior exists here.
- **Other** - React, CI, upstream demo: skip.

Report new user-facing features to the user with a decision each (port now,
defer, skip) and the reason before porting them. The step is done when every
commit in the range has a class and a decision.

### 3. Port

For each ported change, diff the upstream file and apply it to the local file
of the same name, in TypeScript and local style:

```sh
git -C "$TMP/modal" diff <synced>..<target> -- vue/src/modalStack.ts
```

- Keep every divergence listed in `UPSTREAM.md`. When upstream fixes one the
  same way, take upstream's code and drop the divergence entry.
- Port upstream's tests for the change (`vue/tests/*.test.js` ->
  `tests/unit/*.test.ts`) and check that each fails without the port.
- New config keys, slot props, events, exports, or `ModalLink` props follow
  the follow-up list in the mirror map.
- Protocol changes need a demo route and an e2e test in
  `demo-app/tests/e2e/modals.spec.ts`.

### 4. Refresh dependencies

- Match `@inertiaui/vanilla` to the range upstream's `vue/package.json`
  requires, in root `package.json` and `demo-app/package.json`.
- Raise `@inertiajs/*` and `vue` peer minimums only to what ported code needs.
- Move the demo to the target Laravel package:
  `cd demo-app && composer require inertiaui/modal:<version>`.
- Run `bun install` at the root and `npm install` in `demo-app`.

### 5. Verify

Run the verification commands and smoke tests in
`references/upgrade-checklist.md`. The step is done when every command passes
or the failure is reported.

### 6. Record

- Update `UPSTREAM.md` from `references/upstream-tracker-template.md`:
  synced commit, ported changes, the divergence list, residual risk.
- Update `README.md` and `docs/` for consumer-visible changes, and `AGENTS.md`
  for durable rules.
- Upstream bugs found while porting: ask the user before reporting them to
  `inertiaui/modal`.

Report the synced range, each commit's decision, files changed, verification
results, and residual risk.

## Stop Conditions

- A protocol change without enough context to port it: stop and report the
  commit and the open decision.
- Unrelated dirty files overlap required edits: preserve them and make the
  smallest compatible change.
- Duplicate Vue, Vuetify, or Inertia runtimes after install: fix the metadata
  or demo dedupe before claiming the sync complete.
