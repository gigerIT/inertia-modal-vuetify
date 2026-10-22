# Project Overview

`@gigerit/inertia-modal-vuetify` is a Vue 3/Vuetify 3 library that provides a
Vuetify-styled, drop-in adapter for `@inertiaui/modal-vue`. The package keeps
the upstream modal API, navigation, stack, slots, and lifecycle behavior while
rendering modal and slideover content through Vuetify components. This repo
also contains a Vite example app and a Laravel/Inertia demo app for integration
testing and manual verification.

## Repository Structure

- `.agents/` - Repo-owned agent skills and workflow documentation.
- `.github/` - CI (`ci.yml`) and Release Please publishing workflows.
- `_bmad/` - BMAD workflow/config files used to generate project context.
- `_bmad-output/` - Generated BMAD project context for AI agents.
- `demo-app/` - Laravel 12 + Inertia + Vue/Vuetify demo application.
- `docs/` - User-facing package documentation, mostly upstream-compatible
  modal topics adapted for this package.
- `example/` - Small standalone Vite/Vue/Vuetify example app.
- `src/` - Published package source, public exports, and hand-written types
  (`src/index.d.ts`).
- `tests/` - Vitest + happy-dom suite for the package.
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

Root package tests:

```sh
bun run test
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

Demo ESLint configuration regression tests:

```sh
cd demo-app
npm run lint:test
```

Demo type check (also validates `src/index.d.ts` against real usage):

```sh
cd demo-app
npm run typecheck
```

Demo app Pest/PHPUnit tests:

```sh
cd demo-app
composer run test
```

> TODO: No root lint or formatter config exists.

## Code Style & Conventions

- Keep root package source as JavaScript Vue SFCs under `src/`.
- Use ESM syntax and preserve `"type": "module"` in root `package.json`.
- Treat `src/index.js` as the public API; new public helpers/components need an
  explicit export and a matching declaration in `src/index.d.ts`.
- Import Vuetify components explicitly (`vuetify/components/VDialog`) and use
  PascalCase tags in package SFCs. The built `dist` cannot rely on global
  registration or `vite-plugin-vuetify` auto-imports in consumer apps.
- Prefer Vue `<script setup>` and Composition API primitives already in use.
- Match the touched file's local style. Source currently mixes quote and indent
  style, and no root ESLint/Prettier config exists.
- Use PascalCase for Vue component filenames and camelCase for JS identifiers.
- Preserve consumer-facing `im-` CSS classes as public customization hooks.
- Demo TypeScript is strict in `demo-app/tsconfig.json`; package source is not
  TypeScript.
- Demo ESLint uses Vue essential, TypeScript ESLint recommended, the Vue parser,
  and Prettier. `npm run lint:test` checks Vue/TypeScript parsing and lint rules.
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
    CloseButton[CloseButton.vue]
    Config[src/config.js]
    Vuetify[Vuetify v-dialog/v-card/v-btn]
    Demo[demo-app and example]

    Consumer --> PublicAPI
    PublicAPI --> Upstream
    PublicAPI --> Modal
    PublicAPI --> Config
    Config --> Upstream
    Modal --> Upstream
    Modal --> ModalContent
    ModalContent --> CloseButton
    ModalContent --> Vuetify
    CloseButton --> Vuetify
    Demo --> PublicAPI
```

`@inertiaui/modal-vue` owns modal routing, state, stack, lifecycle, local
modals, deferred props, and app rendering helpers; `ModalLink` and most helpers
are re-exported unchanged. This package adapts the presentation layer to
Vuetify: `Modal.vue` wraps `HeadlessModal` and forwards its events, slot props,
and exposed API, and `ModalContent.vue` renders one `v-dialog` + `v-card` for
both modals and slideovers.

`ModalContent.vue` maps config to `v-dialog` props: `closeExplicitly` →
`persistent`, `position` → `location`, `maxWidth` → `max-width`, and only the
top modal gets a scrim. Slideovers are full-height dialogs on a physical side
(RTL-aware) with a Web Animations slide that fades under reduced motion. It
calls `modalContext.afterLeave` from the dialog's `after-leave`, provides
`modalContext` so slot content of local modals can call `useModal()`, marks
the configured `appElement` `aria-hidden` while open, and returns focus to the
element that opened the modal. Vuetify's own scroll blocking and focus trap
are used; do not add upstream's `lockScroll` on top.

`src/config.js` maps upstream max-width tokens to Tailwind's widths and modal
positions to Vuetify locations; unknown max-width tokens intentionally fall
back to `2xl`. It also wraps upstream `putConfig`/`resetConfig` so the
`paddingClasses`/`panelClasses` defaults are Vuetify classes; upstream's are
Tailwind (`bg-white` is a real Vuetify utility and breaks dark themes).

The root library build outputs one ESM bundle to `dist/` with no CSS and keeps
Vue, Vuetify, Inertia, and the upstream modal packages external. Types live in
`src/index.d.ts` and serve both `.` and `./src` exports. The demo app aliases
`@gigerit/inertia-modal-vuetify` to `../src/index.js` (and `tsconfig` `paths` to
`../src/index.d.ts`), dedupes Vue/Vuetify/Inertia/modal imports to its own
`node_modules`, and must declare the adapter's runtime dependencies itself.

## Testing Strategy

- Minimum verification for package source/export changes: `bun run test` and
  `bun run build`.
- `tests/Modal.test.js` mounts real Vuetify dialogs in happy-dom with real
  transitions (`stubs: { transition: false }`) and drives local modals through
  the upstream stack. Extend it for lifecycle changes, and check that a new
  test fails when the behavior it covers is removed.
- Changes to `src/index.d.ts` must pass `npm run typecheck` in `demo-app`.
- For integration-facing changes, also run `bun run build:example` and the demo
  app build from `demo-app`.
- Demo Laravel tests run through `composer run test`; they cover the demo's
  modal routes, not adapter behavior.
- For UI/lifecycle changes, manually verify modal open/close, backdrop close,
  Escape close, `closeExplicitly`, `closeOnClickOutside`, left/right
  slideovers, nested stacks, scrim behavior, `aria-hidden`, focus return, and
  transition cleanup in both light and dark themes. Use `example/` for local
  modals and `demo-app/` for routed, navigate-mode, and SSR behavior.
- The DOM is not proof of cleanup: Vuetify removes a closed dialog's overlay
  even when `afterLeave` never ran. Check that `useModalStack().stack` empties.
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
- `closeExplicitly` maps to `v-dialog` `persistent`, which blocks backdrop and
  Escape. Browser back belongs to Inertia and upstream `ModalRoot`; Vuetify's
  `close-on-back` only works with vue-router, so keep it `false`.
- The package ships no CSS: Vite library builds do not inject it, and consumers
  could not import it. Express layout through `v-dialog` props, `content-props`
  styles, and Vuetify utility classes. Vuetify dialog content is teleported, so
  any consumer CSS must use global selectors.
- Route configuration defaults through `src/config.js`; never let upstream's
  Tailwind `paddingClasses`/`panelClasses` defaults reach rendered markup.
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
- `getConfig` comes from `@inertiaui/modal-vue`; `putConfig` and `resetConfig`
  are wrapped in `src/config.js` to keep Vuetify class defaults.
- `renderApp(App, props)` must be used when mounting Inertia apps that use this
  modal adapter.
- `ModalLink` is upstream's component, re-exported unchanged; `:as="VBtn"`
  renders it as a Vuetify button.
- `Modal` accepts upstream-compatible modal config such as `closeButton`,
  `closeExplicitly`, `maxWidth`, `paddingClasses`, `panelClasses`, `position`,
  and `slideover`.
- `getMaxWidth()` and `getDialogLocation()` are package helper hooks in
  `src/config.js`.
- Demo app Vite aliases can be adjusted in `demo-app/vite.config.ts` when
  testing source versus built package behavior; keep `tsconfig.json` `paths`
  in sync.
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
