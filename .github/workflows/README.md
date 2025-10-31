# GitHub Actions Workflows

## Release Please Workflow

This workflow uses [release-please](https://github.com/google-github-actions/release-please-action) to automatically manage versioning and releases.

### How it works:

1. **Versioning**: When you push commits to `main` with conventional commit messages, release-please analyzes them and creates a pull request with version bumps.

2. **Commit Message Format**:
   - `feat:` - Minor version bump (e.g., 0.1.0 → 0.2.0)
   - `fix:` - Patch version bump (e.g., 0.1.0 → 0.1.1)
   - `feat!:` or `BREAKING CHANGE:` - Major version bump (e.g., 0.1.0 → 1.0.0)

3. **Release Process**:
   - When the release PR is merged, the workflow:
     - Builds the package
     - Publishes to npm
     - Creates a GitHub release with changelog

### Setup Required:

1. **NPM Token**: Add `NPM_TOKEN` secret to your GitHub repository settings
   - Go to Settings → Secrets and variables → Actions
   - Add a new secret named `NPM_TOKEN`
   - Get your token from https://www.npmjs.com/settings/YOUR_USERNAME/tokens

2. **Package Scope**: If using a scoped package (`@gigerit/inertia-modal-vuetify`), ensure your npm account has access to publish to that scope.

### Manual Release:

To trigger a release manually, merge the release PR created by release-please, or push a commit with a conventional commit message and wait for the PR to be created.

