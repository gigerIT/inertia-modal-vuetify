# Dependency Sync Procedure

Use this when refreshing `@inertiaui/modal-vue` from upstream
`https://github.com/inertiaui/modal`.

## What Gets Tracked In Git

This repo does not commit upstream modal source. It commits adapter source,
metadata, lockfiles, docs, demos, and generated package output when requested.

Tracked sync paths usually include:

- `package.json`
- `bun.lock`
- `dist/**`
- `src/**`
- `docs/**`
- `example/**`
- `demo-app/package.json`
- `demo-app/package-lock.json` or other demo lockfile
- `demo-app/composer.json` / `demo-app/composer.lock` when backend demo sync changes
- repo-root `UPSTREAM.md`

Do not edit `node_modules/**`, `demo-app/vendor/**`, or cache/storage artifacts.

## Resolve Target Version

```sh
git ls-remote https://github.com/inertiaui/modal.git HEAD refs/heads/main
npm view @inertiaui/modal-vue version dist-tags repository --json
```

Read previous sync from repo-root `UPSTREAM.md` if present. If the user gives a
target version/tag/commit, use that target and record it.

Use a temporary clone outside the repo for source diffs:

```sh
set -euo pipefail

TARGET=<target-upstream-commit-or-tag>
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

git clone https://github.com/inertiaui/modal.git "$TMP/modal"
git -C "$TMP/modal" checkout "$TARGET"
```

Inspect changes before editing:

```sh
git -C "$TMP/modal" diff --stat <previous>..<target>
git -C "$TMP/modal" diff --name-status <previous>..<target>
git -C "$TMP/modal" log --oneline <previous>..<target>
```

Prioritize upstream changes under `vue/`, `resources/js`, package metadata,
docs, and changelog/release notes.

## Refresh Root Dependency

Use Bun at the root because this package uses `bun.lock`.

```sh
bun add @inertiaui/modal-vue@<version-or-tag>
```

If only lockfile refresh is needed:

```sh
bun install
```

After install, verify root metadata:

- `@inertiaui/modal-vue` remains in root `dependencies`.
- `@inertiaui/modal-vue` remains external in `vite.config.js`.
- Root `peerDependencies` match real minimums for Vue, Vuetify, and Inertia.
- No duplicate nested Vue/Inertia/modal runtime appears in dependency output.

## Refresh Example App

The standalone example uses root package scripts and source. If package metadata
or dev dependencies changed, reinstall from the root and run:

```sh
bun run build:example
```

Check `example/vite.config.js` if local aliasing or dependency resolution changed.

## Refresh Demo App

The Laravel demo consumes this adapter through `file:..` and aliases the package
name to `../src/index.js` for local source testing.

```sh
cd demo-app
npm install
```

If Composer backend package constraints changed:

```sh
cd demo-app
composer update inertiaui/modal --with-all-dependencies
```

Preserve the demo Vite alias unless intentionally testing the built package:

- `@gigerit/inertia-modal-vuetify` -> `../src/index.js`
- `@inertiaui/modal-vue` -> demo `node_modules/@inertiaui/modal-vue`

## Regenerate Adapter Build Output

```sh
bun run build
```

Generated `dist/**` is gitignored except `dist/index.d.ts` in this checkout.
Only include generated outputs when the task or release workflow expects them.

## Commit Scope Expectations

Typical sync work includes some or all of:

- root package metadata and `bun.lock`
- adapter fixes in `src/`
- docs/example/demo updates
- demo lockfiles
- `dist/index.d.ts` when public types changed
- repo-root `UPSTREAM.md` after verification passes

Do not commit unrelated dirty files. Preserve pre-existing local changes outside
the sync scope.
