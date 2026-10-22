# GitHub Actions Workflows

- `ci.yml` runs on pull requests and pushes to `master`: package tests and
  builds, plus the demo app's lint, type check, client/SSR builds, and Pest
  tests.
- `release-please.yml` turns Conventional Commits on `master` into a release
  PR. Merging it tags the release, runs the tests, builds, and publishes to npm
  through trusted publishing (OIDC, no `NPM_TOKEN`). Run it manually with
  `tag_name` to republish an existing tag.

Commit types map to versions: `fix:` → patch, `feat:` → minor, `feat!:` or a
`BREAKING CHANGE:` footer → major.
