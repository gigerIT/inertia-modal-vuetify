# UPSTREAM.md Template

Create or update repo-root `UPSTREAM.md` only after verification passes. Copy
this template and replace placeholders.

```markdown
# Upstream Tracker

Last verified sync for this adapter against `inertiaui/modal`.

## Source

- Repository: https://github.com/inertiaui/modal.git
- Branch: main
- Synced commit: `<full-sha-or-tag>`
- Synced commit title: `<subject line>`
- Synced at: `<YYYY-MM-DD>`

## Upstream Vue Package

- Package: `@inertiaui/modal-vue`
- Version: `<package version>`
- Install source: npm package / Composer-linked package / other: `<note>`

## Adapter Changes Required

- `<bullet list of adapter files/behavior updated for this sync>`
- `<or "none - dependency/metadata-only sync">`

## Demo And Docs Changes

- `<short note or "none">`

## Verification

- [ ] `bun run build`
- [ ] `bun run build:example`
- [ ] `cd demo-app && npm run build`
- [ ] `cd demo-app && npm run build:ssr`
- [ ] `cd demo-app && npm run format:check`
- [ ] `cd demo-app && composer run test`
- [ ] `bun list --all | rg '@inertiaui/modal-vue|@inertiajs/vue3|vue@|vuetify'`
- [ ] `npm pack --dry-run --json`
- [ ] Manual smoke completed when UI behavior changed

## Residual Risk

- `<untested areas or follow-up work>`
```

Keep `UPSTREAM.md` factual and short. Do not duplicate full upgrade checklists
here; link to this skill's `references/upgrade-checklist.md` instead.
