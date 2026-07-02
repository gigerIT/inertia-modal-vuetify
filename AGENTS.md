# Project Overview

`@gigerit/inertia-modal-vuetify` is a Vue 3/Vuetify 3 library that provides a
Vuetify-styled, drop-in adapter for `@inertiaui/modal-vue`. The package keeps
the upstream modal API, navigation, stack, slots, and lifecycle behavior while
rendering modal and slideover content through Vuetify components. This repo
also contains a Vite example app and a Laravel/Inertia demo app for integration
testing and manual verification.

## Repository Structure

- `.agents/` - Repo-owned agent skills and workflow documentation.
- `_bmad/` - BMAD workflow/config files used to generate project context.
- `_bmad-output/` - Generated BMAD project context for AI agents.
- `demo-app/` - Laravel 12 + Inertia + Vue/Vuetify demo application.
- `docs/` - User-facing package documentation, mostly upstream-compatible
  modal topics adapted for this package.
- `example/` - Small standalone Vite/Vue/Vuetify example app.
- `src/` - Published package source and public exports.
- `bun.lock` - Root Bun lockfile for the package workspace.
- `package.json` - Package metadata, npm exports, peer deps, and build scripts.
- `release-please-config.json` - Release Please config for changelog/versioning.
- `vite.config.js` - Root Vite library build config.

## Build & Development Commands

Root package install:

```sh
bun install
```

Root package development server for `example/`:

```sh
bun run dev
```

Root package build:

```sh
bun run build
```

Example app build:

```sh
bun run build:example
```

Package prepublish build hook:

```sh
npm run build
```

Demo app setup:

```sh
cd demo-app
composer run setup
```

Demo app dev stack:

```sh
cd demo-app
composer run dev
```

Demo app SSR dev stack:

```sh
cd demo-app
composer run dev:ssr
```

Demo app frontend build:

```sh
cd demo-app
npm run build
```

Demo app SSR build:

```sh
cd demo-app
npm run build:ssr
```

Demo app lint/format:

```sh
cd demo-app
npm run lint
npm run format:check
npm run format
```

Demo app Pest/PHPUnit tests:

```sh
cd demo-app
composer run test
```

> TODO: No root JavaScript test, lint, type-check, debug, or deploy scripts are
> defined in `package.json`.

> TODO: No CI workflow file is present in this checkout.

## Code Style & Conventions

- Keep root package source as JavaScript Vue SFCs under `src/`.
- Use ESM syntax and preserve `"type": "module"` in root `package.json`.
- Treat `src/index.js` as the public API; new public helpers/components need an
  explicit export.
- Prefer Vue `<script setup>` and Composition API primitives already in use.
- Match the touched file's local style. Source currently mixes quote and indent
  style, and no root ESLint/Prettier config exists.
- Use PascalCase for Vue component filenames and camelCase for JS identifiers.
- Preserve consumer-facing `im-` CSS classes as public customization hooks.
- Demo TypeScript is strict in `demo-app/tsconfig.json`; package source is not
  TypeScript.
- Demo ESLint uses Vue essential, Vue TypeScript recommended, and Prettier.
- Demo Prettier config lives at `demo-app/.prettierrc`.
- Commit messages should use Conventional Commits (`feat:`, `fix:`, `docs:`,
  `refactor:`, `test:`, `chore:`); Release Please maps these to changelog
  sections.

## Architecture Notes

```mermaid
flowchart TD
    Consumer[Consumer Inertia/Vue App]
    PublicAPI[src/index.js public API]
    Upstream[@inertiaui/modal-vue]
    Modal[Modal.vue]
    ModalContent[ModalContent.vue]
    Slideover[SlideoverContent.vue]
    CloseButton[CloseButton.vue]
    Config[src/config.js]
    Vuetify[Vuetify v-dialog/v-card/v-btn]
    Demo[demo-app and example]

    Consumer --> PublicAPI
    PublicAPI --> Upstream
    PublicAPI --> Modal
    PublicAPI --> Config
    Modal --> Upstream
    Modal --> ModalContent
    Modal --> Slideover
    ModalContent --> CloseButton
    Slideover --> CloseButton
    ModalContent --> Vuetify
    Slideover --> Vuetify
    CloseButton --> Vuetify
    Demo --> PublicAPI
```

`@inertiaui/modal-vue` owns modal routing, state, stack, lifecycle, local
modals, deferred props, and app rendering helpers. This package adapts the
presentation layer to Vuetify by wrapping `HeadlessModal` in `Modal.vue` and
choosing `ModalContent.vue` or `SlideoverContent.vue` based on config.

`ModalContent.vue` renders centered dialog content. `SlideoverContent.vue`
renders drawer-style content using Vuetify slide transitions. Both provide the
computed `modalContext` injection for nested controls such as `CloseButton.vue`
and call `modalContext.afterLeave` from the actual Vue/Vuetify leave
transition.

`src/config.js` maps upstream Tailwind-style max-width tokens to pixel values
for Vuetify and maps modal positions to Vuetify locations. Unknown max-width
tokens intentionally fall back to `2xl`.

The root library build outputs ESM and CommonJS bundles to `dist/` and keeps
Vue, Vuetify, Inertia, and upstream modal packages external. The demo app
aliases `@gigerit/inertia-modal-vuetify` to `../src/index.js` so local source
changes can be tested before publishing.

## Testing Strategy

- Root package has no JavaScript test runner at present.
- Minimum verification for package source/export changes: run `bun run build`.
- For integration-facing changes, also run `bun run build:example` and the demo
  app build from `demo-app`.
- Demo Laravel tests run through `composer run test`; current tests are starter
  examples and do not validate modal behavior.
- For UI/lifecycle changes, manually verify modal open/close, backdrop close,
  Escape close, `closeExplicitly`, left/right slideovers, nested stacks,
  scrim behavior, `aria-hidden`, and transition cleanup.
- For packaging changes, test both published root exports and the demo alias to
  `src/index.js`.
- Add focused automated coverage when introducing pure helpers or test
  infrastructure; do not treat placeholder demo tests as modal coverage.

## Security & Compliance

- Do not commit real `.env` files or secrets. `demo-app/.env.example` is the
  committed template.
- Keep Vue, Vuetify, Inertia, and `@inertiaui/modal-vue` external in the root
  Vite build to avoid duplicate runtimes and broken injection/state.
- The package license is MIT in root `package.json`.
- Release Please owns release versioning and changelog updates unless the user
  explicitly requests a release task.
- If blocked by a bug/gap in a dependency owned by `gigerit`, do not patch or
  work around it in this consuming project. Stop and report package, version,
  expected/actual behavior, repro path, and suggested upstream fix.

> TODO: No dependency scanning, SAST, or license scanning config is present in
> this checkout.

## Agent Guardrails

- Treat the worktree as shared. Do not alter, stage, commit, move, delete, or
  reformat unrelated changes.
- Do not remove or rename public exports, props, slots, events, exposed methods,
  or `im-` CSS classes without an explicit breaking-change decision.
- Do not reimplement upstream `@inertiaui/modal-vue` modal behavior locally.
  Research upstream docs/source/issues first when lifecycle behavior changes.
- Preserve `HeadlessModal` compatibility: forwarded events, slot props, and
  exposed methods/getters are public surface.
- `closeExplicitly` must block backdrop, Escape, and browser-back closure
  consistently through Vuetify dialog behavior.
- Vuetify dialog content is teleported. Use global selectors when changing
  overlay-container layout; scoped selectors cannot reach teleported wrappers.
- Preserve stacked-modal behavior: only top modal gets scrim, covered modals use
  `aria-hidden`, and modal context controls focus/blur state.
- `false` is meaningful for class and close-button config. Do not replace
  nullish/boolean semantics with truthy defaults without compatibility review.
- Keep generated outputs such as `dist/`, `demo-app/vendor/`, `node_modules/`,
  and Laravel cache/storage artifacts out of manual edits unless the task
  explicitly targets them.
- Do not edit `_bmad-output/project-context.md` casually. Update it only when
  the user asks for BMAD/project-context regeneration or repo-wide agent facts
  materially change.

## Extensibility Hooks

- Public exports live in `src/index.js`.
- `putConfig`, `getConfig`, and `resetConfig` come from `@inertiaui/modal-vue`
  and control modal defaults.
- `renderApp(App, props)` must be used when mounting Inertia apps that use this
  modal adapter.
- `ModalLink` forwards attributes and slot content to upstream `ModalLink`.
- `Modal` accepts upstream-compatible modal config such as `closeButton`,
  `closeExplicitly`, `maxWidth`, `paddingClasses`, `panelClasses`, `position`,
  and `slideover`.
- `getMaxWidth()` and `getDialogLocation()` are package helper hooks in
  `src/config.js`.
- Demo app Vite aliases can be adjusted in `demo-app/vite.config.ts` when
  testing source versus built package behavior.
- Environment variables follow Laravel/Vite conventions in `demo-app/.env*`,
  including `VITE_APP_NAME`.

## Further Reading

- [README.md](README.md)
- [CHANGELOG.md](CHANGELOG.md)
- [docs/introduction.md](docs/introduction.md)
- [docs/installation.md](docs/installation.md)
- [docs/basic-usage.md](docs/basic-usage.md)
- [docs/configuration.md](docs/configuration.md)
- [docs/modal-props.md](docs/modal-props.md)
- [docs/nested-stacked-modals.md](docs/nested-stacked-modals.md)
- [docs/headless-mode.md](docs/headless-mode.md)
- [example/README.md](example/README.md)
- [_bmad-output/project-context.md](_bmad-output/project-context.md)
