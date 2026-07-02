# Deferred Work

- `package.json` / upstream `@inertiaui/modal-vue@3.1.2`: CommonJS `require()` path fails because upstream CJS requires ESM-only `@inertiaui/vanilla`, which has no `require` export. Decide in a separate packaging task whether to remove the adapter's CJS export in a breaking release, wait for upstream to publish CJS-compatible vanilla/modal output, or adopt an explicit ESM-only package contract.
