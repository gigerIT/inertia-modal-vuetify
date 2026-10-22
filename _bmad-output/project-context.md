---
project_name: 'inertia-modal-vuetify'
user_name: 'Manu'
date: '2026-07-02'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'quality_rules', 'workflow_rules', 'anti_patterns']
existing_patterns_found: 8
status: 'complete'
rule_count: 40
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

- Package: `@gigerit/inertia-modal-vuetify` 2.x, ESM-only library build, hand-written types in `src/index.d.ts`
- Peers: Vue `^3.5.0`, Vuetify `^4.2.0` (dialog `location`), `@inertiajs/vue3` `^3.0.0`
- Dependencies: `@inertiaui/modal-vue` `^3.1.2`, `@inertiaui/vanilla` `^1.5.0`
- Tooling: Vite 8, `@vitejs/plugin-vue` 6, Vitest 5 with happy-dom and `@vue/test-utils`
- Demo app: Laravel 13, PHP `^8.3`, Inertia Laravel 3, `inertiaui/modal` 3, Pest 5, TypeScript 6, Vite 8

## Critical Implementation Rules

### Language-Specific Rules

- Keep package source in JavaScript Vue SFCs under `src/`; TypeScript strict mode applies to `demo-app/resources/js`, not package source.
- Use ESM syntax. Keep relative package imports explicit (`./Component.vue`, `./config.js`) and preserve `"type": "module"`.
- Treat `src/index.js` as public API. New public components/helpers require an explicit export; do not remove or rename existing re-exports without a breaking-change decision.
- Prefer Vue `<script setup>` and Composition API primitives already used (`ref`, `computed`, `provide`, `inject`, `toValue`).
- Do not infer a root formatting standard from current source: quote and indentation styles are mixed, and no package-level ESLint/Prettier config exists. Match the touched file and avoid unrelated formatting churn.

### Framework-Specific Rules

- `@inertiaui/modal-vue` owns modal state, navigation, stack, and lifecycle. Keep Vuetify components as presentation adapters; do not reimplement upstream modal behavior locally.
- Preserve `HeadlessModal` contract one-for-one: forwarded events, slot props, and exposed methods/getters are public compatibility surface.
- Call `modalContext.afterLeave` from the actual Vuetify/Vue leave transition. Premature or duplicate calls can break stack cleanup.
- `closeExplicitly` maps to Vuetify `persistent` (backdrop and Escape). Browser back belongs to Inertia/upstream `ModalRoot`; Vuetify `close-on-back` needs vue-router and stays `false`.
- Preserve stacked-modal semantics: only top modal gets scrim; covered modals expose `aria-hidden`; modal context drives focus/blur and blur styling.
- Continue providing `modalContext` as a ref from `ModalContent.vue`; slot content of local modals (including `CloseButton`) reaches the modal only through it via `useModal()`.
- The package ships no CSS (library builds do not inject it). Express layout through `v-dialog` props, `content-props` styles, and Vuetify utilities.
- Use Vuetify components/utilities for package styling. Tailwind-like `maxWidth` tokens are API compatibility values and must pass through `getMaxWidth`.
- Demo app must mount with `renderApp(App, props)`, then install both Inertia and Vuetify plugins.

### Testing Rules

- `bun run test` runs the Vitest suite in `tests/`; it mounts real Vuetify dialogs and drives local modals through the upstream stack. Demo Pest tests cover demo routes only.
- At minimum, run `bun run test` and the library build after source or export changes. Run the demo build and `npm run typecheck` after integration-facing or type changes.
- Manually verify modal and slideover opening/closing, backdrop and Escape behavior, `closeExplicitly`, left/right slideovers, transition cleanup, and nested stacks for UI/lifecycle changes.
- Test both public import paths affected by packaging changes: package root built output and demo alias to `src/index.js`.
- Add focused automated coverage when changing pure helpers or introducing test infrastructure; do not claim existing coverage from placeholder tests.

### Code Quality & Style Rules

- Keep package components in `src/`, public exports in `src/index.js`, compatibility helpers in `src/config.js`, and integration examples in `demo-app/` or `example/`.
- Use PascalCase for Vue component filenames and camelCase for JavaScript identifiers/config keys. Consumer-facing Vue props remain kebab-case in templates.
- Keep comments rare and focused on non-obvious compatibility or teleport/lifecycle behavior.
- Preserve `im-` CSS class names as consumer customization hooks. Treat renames/removals as public API changes.
- Do not copy upstream Tailwind assumptions into implementation. `docs/` contains upstream-oriented material; README and current Vuetify source are authoritative for this adapter.
- Avoid dead handlers, imports, state, and CSS. Existing unused code is not a pattern to extend.

### Development Workflow Rules

- Direct work on `master` is normal unless the user requests a branch or PR.
- Treat the worktree as shared. Never alter, stage, commit, reformat, move, or delete unrelated changes.
- Use Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`); release-please derives versions and changelog sections from them.
- Let release-please own release versioning/changelog updates unless performing an explicit release task.
- CI (`.github/workflows/ci.yml`) and release use Bun with frozen lockfiles; release runs tests and the build before npm trusted publishing. Keep `bun.lock` and `demo-app/package-lock.json` synchronized with dependency changes.
- Build output is `dist/inertia-modal-vuetify.js` (ESM); Vue, Vuetify, Inertia, and upstream modal packages remain external.

### Critical Don't-Miss Rules

- Maintain drop-in API compatibility with `@inertiaui/modal-vue`. Styling changes must not silently alter navigation, slots, events, exposed methods, local modals, deferred props, or nested stacks.
- Do not patch or duplicate upstream dependency internals to solve lifecycle behavior. Research official docs, installed source, and upstream issues first.
- If blocked by a bug in a dependency owned by `gigerit`, stop and report package/version, expected versus actual behavior, repro path, and suggested upstream fix. Do not add a consuming-project workaround without explicit user approval.
- Vuetify dialog content is teleported. Scoped selectors cannot fix overlay-container layout; verify selector scope before changing CSS.
- Preserve package externalization. Bundling Vue, Vuetify, Inertia, or `@inertiaui/modal-vue` can create duplicate runtimes and broken injection/state.
- `false` is meaningful for configurable classes and close-button behavior. Do not replace nullish/boolean semantics with truthy defaults without checking API compatibility.
- Width tokens outside the supported map intentionally fall back to `2xl`; changing token sizes or fallback is consumer-visible.
- Upstream config defaults are Tailwind classes; `src/config.js` wraps `putConfig`/`resetConfig` so Vuetify class defaults apply. Never bypass it.
- Root dependencies may be absent in a fresh checkout. Install with Bun from `bun.lock` before treating build failures as source defects.

---

## Usage Guidelines

**For AI Agents:**

- Read this file before implementing code.
- Follow all rules exactly; when uncertain, prefer the more restrictive compatible option.
- Update this file when new non-obvious patterns become established.

**For Humans:**

- Keep this file lean and focused on agent needs.
- Update it when stack, public API, architecture, or workflow changes.
- Review periodically and remove stale or obvious rules.

Last Updated: 2026-10-22
