# Changelog

## [3.0.0](https://github.com/gigerIT/inertia-modal-vuetify/compare/v2.1.0...v3.0.0) (2026-10-22)


### ⚠ BREAKING CHANGES

* requires vuetify ^4.2.0. Package is ESM-only; the CommonJS build could not be required anyway. max-width tokens use upstream's Tailwind widths (2xl 672px, md 448px). The modal close button overlays the top-right corner instead of taking its own row.

### Features

* rebuild Vuetify presentation layer ([24fd501](https://github.com/gigerIT/inertia-modal-vuetify/commit/24fd5017d5cd015ca5aeda678802e8f1f12da027))


### Bug Fixes

* **deps:** refresh compatible frontend security graphs ([9a4f841](https://github.com/gigerIT/inertia-modal-vuetify/commit/9a4f841eff08f311c078c1fbe568de81d300e368))
* **deps:** refresh frontend dependency graphs ([07def39](https://github.com/gigerIT/inertia-modal-vuetify/commit/07def395c8ca4241a2173dc29c1a65b18c8dbbe2))


### Documentation

* **agents:** sync agent guidance with rebuilt adapter ([f4b6b0b](https://github.com/gigerIT/inertia-modal-vuetify/commit/f4b6b0be3d9b8c4889233d23b689733968735831))
* drop React examples and document Vuetify setup ([bc8bccd](https://github.com/gigerIT/inertia-modal-vuetify/commit/bc8bccdded1cedf8aaf78f8e515bfd32cb26b30c))


### Miscellaneous Chores

* **demo-app:** upgrade to Laravel 13 and Inertia 3 ([95428fe](https://github.com/gigerIT/inertia-modal-vuetify/commit/95428fee63be6d1e86f60502bf49b73f8982e409))
* **example:** rebuild as local modal playground ([3abc920](https://github.com/gigerIT/inertia-modal-vuetify/commit/3abc92010629d4becaae53ba0a0924b97e4a21c5))

## [2.1.0](https://github.com/gigerIT/inertia-modal-vuetify/compare/v2.0.0...v2.1.0) (2026-07-02)


### Features

* add modal accessibility lifecycle ([9ce1993](https://github.com/gigerIT/inertia-modal-vuetify/commit/9ce19932e02113cd307ddd499b77d4b826d5b570))
* add package type declarations ([2fa398a](https://github.com/gigerIT/inertia-modal-vuetify/commit/2fa398a5baca447bef7e96936d560b523b0c74d2))
* expose upstream modal v3 helpers ([ee6768a](https://github.com/gigerIT/inertia-modal-vuetify/commit/ee6768af2dc36c11de987e1d6dead855ff37d82c))
* support outside click close config ([c6b92fa](https://github.com/gigerIT/inertia-modal-vuetify/commit/c6b92fa73e1dd42271905a7fd48e56ab31fa73aa))

## [2.0.0](https://github.com/gigerIT/inertia-modal-vuetify/compare/v1.2.0...v2.0.0) (2026-07-02)


### ⚠ BREAKING CHANGES

* vuetify peer dependency now requires ^4.0.0 and vue requires ^3.5.0.

### Features

* support Vuetify 4 ([7ac209a](https://github.com/gigerIT/inertia-modal-vuetify/commit/7ac209ae873c6037ace74138175644f2d620d8c4))

## [1.2.0](https://github.com/gigerIT/inertia-modal-vuetify/compare/v1.1.2...v1.2.0) (2025-11-12)


### Features

* change readme to trigger release for previous commit ([ccb0f25](https://github.com/gigerIT/inertia-modal-vuetify/commit/ccb0f2522def4c6deb8e5e4d8a267212f6bd5e2d))

## [1.1.2](https://github.com/gigerIT/inertia-modal-vuetify/compare/v1.1.1...v1.1.2) (2025-10-31)


### Bug Fixes

* update modal styles for consistent height and min-height ([08fbcd3](https://github.com/gigerIT/inertia-modal-vuetify/commit/08fbcd3d8f82a0fd0c663589683a856c40cd9164))

## [1.1.1](https://github.com/gigerIT/inertia-modal-vuetify/compare/v1.1.0...v1.1.1) (2025-10-31)


### Bug Fixes

* correctly position close button on the right side ([139d961](https://github.com/gigerIT/inertia-modal-vuetify/commit/139d96135b37763d5e7aa8df3d2d31b92e06808a))

## [1.1.0](https://github.com/gigerIT/inertia-modal-vuetify/compare/v1.0.0...v1.1.0) (2025-10-31)


### Features

* **demo-app:** update dependencies, add test page, and enhance app structure ([ad5de20](https://github.com/gigerIT/inertia-modal-vuetify/commit/ad5de200d6faf7aa85020a383585d5287cfb7d91))
* integrate Vuetify and update app layout ([6ed9417](https://github.com/gigerIT/inertia-modal-vuetify/commit/6ed9417dbb9f920286f7da86b09637d3f616e2d1))


### Bug Fixes

* v-dialog height ([a1486a4](https://github.com/gigerIT/inertia-modal-vuetify/commit/a1486a4e052e5e01c3469864b766e0c4783802b1))

## 1.0.0 (2025-10-31)


### Features

* initial implementation ([0616b90](https://github.com/gigerIT/inertia-modal-vuetify/commit/0616b90636edd443d9981db274274f0ecac39d83))
