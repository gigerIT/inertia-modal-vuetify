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

- Package: `@gigerit/inertia-modal-vuetify` 1.2.0, ESM package with ESM and CommonJS library builds
- Vue `^3.5.24`; package peer compatibility remains `^3.0.0`
- Vuetify `^3.10.10`; package peer compatibility remains `^3.0.0`
- `@inertiajs/vue3` peer `^2.2.15`
- `@inertiaui/modal-vue` dependency `^1.0.0-beta-4`
- Vite `^5.4.21`, `@vitejs/plugin-vue` `^5.2.4`, `vite-plugin-vuetify` `^2.1.2`
- Material Design Icons via `@mdi/font` `^7.4.47`
- Demo app: Laravel `^12.0`, PHP `^8.2`, Inertia Laravel `^2.0`, Pest `^4.1`, TypeScript `^5.9.3`, Vite `^7.1.12`

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
- `closeExplicitly` must block backdrop, Escape, and browser-back closure consistently through Vuetify `persistent` and `close-on-back` behavior.
- Preserve stacked-modal semantics: only top modal gets scrim; covered modals expose `aria-hidden`; modal context drives focus/blur and blur styling.
- Continue providing `modalContext` as a computed injection for nested controls such as `CloseButton`; injected refs may require `toValue`.
- Keep teleported `v-dialog` layout overrides global. Component-local visual rules may remain scoped.
- Use Vuetify components/utilities for package styling. Tailwind-like `maxWidth` tokens are API compatibility values and must pass through `getMaxWidth`.
- Demo app must mount with `renderApp(App, props)`, then install both Inertia and Vuetify plugins.

### Testing Rules

- No package-level JavaScript test runner currently exists. Demo Pest tests are starter placeholders and do not validate modal behavior.
- At minimum, run the package library build after source or export changes. Run the demo build after integration-facing changes.
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
- Release CI uses Node 20, Bun with frozen lockfile, `bun run build`, then public npm publish. Keep `bun.lock` synchronized with dependency changes.
- Build output is `dist/inertia-modal-vuetify.es.js` and `dist/inertia-modal-vuetify.cjs.js`; Vue, Vuetify, Inertia, and upstream modal packages remain external.

### Critical Don't-Miss Rules

- Maintain drop-in API compatibility with `@inertiaui/modal-vue`. Styling changes must not silently alter navigation, slots, events, exposed methods, local modals, deferred props, or nested stacks.
- Do not patch or duplicate upstream dependency internals to solve lifecycle behavior. Research official docs, installed source, and upstream issues first.
- If blocked by a bug in a dependency owned by `gigerit`, stop and report package/version, expected versus actual behavior, repro path, and suggested upstream fix. Do not add a consuming-project workaround without explicit user approval.
- Vuetify dialog content is teleported. Scoped selectors cannot fix overlay-container layout; verify selector scope before changing CSS.
- Preserve package externalization. Bundling Vue, Vuetify, Inertia, or `@inertiaui/modal-vue` can create duplicate runtimes and broken injection/state.
- `false` is meaningful for configurable classes and close-button behavior. Do not replace nullish/boolean semantics with truthy defaults without checking API compatibility.
- Width tokens outside the supported map intentionally fall back to `2xl`; changing token sizes or fallback is consumer-visible.
- The manifest declares `dist/index.d.ts`, but current Vite config does not generate declarations. Verify type artifact generation before changing or relying on the package typing contract.
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

Last Updated: 2026-07-02
