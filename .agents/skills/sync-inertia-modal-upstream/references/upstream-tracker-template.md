# UPSTREAM.md Template

Update repo-root `UPSTREAM.md` after verification passes. Keep the
Divergences section current: it is the list the next sync must preserve.

```markdown
# Upstream Tracker

<one paragraph: what src/ is ported from, which Laravel package it talks to,
and the sync-inertia-modal-upstream skill>

## Source

- Repository: https://github.com/inertiaui/modal.git
- Branch: <upstream default branch, e.g. 3.x>
- Synced commit: `<full sha>`
- Synced commit title: `<subject line>`
- Synced at: `<YYYY-MM-DD>`
- Matches release: `<inertiaui/modal and @inertiaui/modal-vue version>`

## Divergences

Every intended difference from upstream's Vue runtime, with the upstream
issue or PR when there is one. Remove an entry once upstream matches it.

- <runtime fixes and behavior changes>
- <presentation: Vuetify instead of Tailwind, local-only features>

## Last Sync

- Ported: <commits or areas ported, or "none">
- Skipped: <commits and reasons>

## Verification

- [ ] Commands in the skill's `references/upgrade-checklist.md`
- [ ] Manual smoke when behavior changed

## Residual Risk

- <untested areas, unreported upstream bugs, follow-up work>
```
