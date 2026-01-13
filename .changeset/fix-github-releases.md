---
"busical": patch
---

Fix GitHub releases not being created by changesets workflow

Added `createGithubReleases: true` to the changesets action configuration.
This is required for private packages since they don't publish to npm,
and GitHub releases were only created after successful npm publishes.
