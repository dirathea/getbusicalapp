# Release System Documentation

> Automated release management using Changesets with service worker version synchronization

## Table of Contents

1. [Overview](#overview)
2. [How It Works](#how-it-works)
3. [Service Worker Version Sync](#service-worker-version-sync)
4. [Daily Workflow](#daily-workflow)
5. [Release Process](#release-process)
6. [GitHub Actions](#github-actions)
7. [Troubleshooting](#troubleshooting)
8. [Architecture](#architecture)

---

## Overview

This project uses **Changesets** to automate version management and releases. Key features:

- ✅ **Decoupled release notes** - Write user-friendly descriptions separate from commit messages
- ✅ **Automatic versioning** - Semantic versioning based on change types (major/minor/patch)
- ✅ **CHANGELOG generation** - Auto-generated with GitHub PR links
- ✅ **Service worker sync** - SW version automatically matches package.json
- ✅ **GitHub releases** - Auto-created with formatted release notes
- ✅ **Docker automation** - Existing docker-publish workflow triggers on new tags

---

## How It Works

### The Changesets Flow

```
[Make Changes] → [Create Changeset] → [Push to Main] → [GitHub Actions]
                                                              ↓
                                    [Has Changesets?] ← Yes/No
                                            ↓ Yes
                                    [Create Version PR]
                                            ↓
                                    [Review & Merge PR]
                                            ↓
                                [Create Git Tag + GitHub Release + Trigger Docker]
```

### Components

1. **Changesets** (`.changeset/*.md`) - Temporary files describing changes
2. **Version Script** - Bumps version in `package.json` and consumes changesets
3. **Sync Script** (`scripts/sync-sw-version.cjs`) - Updates service worker version
4. **GitHub Actions** - Automates the release process
5. **CHANGELOG.md** - Generated from consumed changesets

---

## Service Worker Version Sync

### Problem Solved

Previously, the service worker version was hardcoded and manually updated:

```javascript
// public/sw.js
const VERSION = 'v1.1.0';  // ❌ Out of sync with package.json (0.0.3)
```

This led to:
- Version mismatches between package and service worker
- Manual maintenance burden
- Potential confusion during debugging

### Solution

**Automated Synchronization Script** (`scripts/sync-sw-version.cjs`)

The script:
1. Reads the version from `package.json`
2. Updates the `VERSION` constant in `public/sw.js`
3. Runs automatically when versions are bumped

```javascript
// Before version bump
const VERSION = 'v0.0.3';

// After version bump to 0.0.4
const VERSION = 'v0.0.4';
```

### Why This Approach?

**Considered alternatives:**

| Approach | Pros | Cons | Decision |
|----------|------|------|----------|
| Build-time injection | Single source of truth | Requires Vite config changes, build complexity | ❌ Rejected |
| Template file | Clean separation | Extra file to maintain, more moving parts | ❌ Rejected |
| Post-version script | Simple, no build changes | File committed to git | ✅ **Chosen** |

**Why the script approach wins:**
- ✅ No build configuration changes
- ✅ Service worker stays in `public/` (expected by PWA)
- ✅ Simple Node.js script (easy to understand)
- ✅ Runs automatically via npm script hook
- ✅ Version committed with other changes (atomic)
- ✅ Works with existing setup

### How It Works

```bash
# When you run version-packages:
npm run version-packages

# Internally executes:
1. changeset version              # Updates package.json, CHANGELOG.md
2. node scripts/sync-sw-version.cjs  # Updates public/sw.js

# Result:
✅ package.json:      "version": "0.0.4"
✅ public/sw.js:      const VERSION = 'v0.0.4';
✅ CHANGELOG.md:      ## 0.0.4 ...
```

### Verification

After running version-packages, verify the sync:

```bash
# Check package.json version
cat package.json | grep '"version"'

# Check service worker version
grep "const VERSION" public/sw.js

# Both should match!
```

---

## Daily Workflow

### During Development

When you complete a feature, fix a bug, or make any user-facing change:

```bash
# 1. Create a changeset
npx changeset

# You'll be prompted:
? Which packages would you like to include?
  ✓ busical

? What kind of change is this for busical?
  ○ major   (Breaking change)
  ● minor   (New feature)
  ○ patch   (Bug fix)

? Please enter a summary for this change:
  ▸ Added email history dropdown for quick email selection

# 2. Commit the changeset
git add .changeset
git commit -m "feat: add email history dropdown"
git push
```

### What Gets Created

A changeset file like `.changeset/happy-cats-dance.md`:

```markdown
---
"busical": minor
---

Added email history dropdown for quick email selection. Users can now see and select from their previously used email addresses.
```

**Important Notes:**
- The changeset description is what users see in release notes
- Write for users, not developers
- Focus on the "why it matters" not the "what was coded"
- Multiple changesets can accumulate before a release

---

## Release Process

### Option A: Automated (Recommended)

Let GitHub Actions handle everything:

```bash
# 1. Just push your changesets to main
git push origin main

# 2. GitHub Actions will:
#    - Detect changesets exist
#    - Create a "Version Packages" PR
#    - PR shows: version bump, changelog preview, file changes

# 3. Review the PR and merge it

# 4. On merge, GitHub Actions will:
#    - Create git tag (e.g., v0.0.4)
#    - Create GitHub release with changelog
#    - Trigger docker-publish workflow
```

### Option B: Manual (Your Current Style)

Control the release locally:

```bash
# 1. Consume changesets and bump version
npm run version-packages

# This will:
# - Update package.json version
# - Update CHANGELOG.md
# - Update public/sw.js version
# - Delete consumed changeset files

# 2. Review the changes
git diff

# 3. Commit and tag
git add .
git commit -m "chore: version packages"
git tag v0.0.4
git push --follow-tags

# 4. GitHub release created automatically
# 5. Docker publish triggered by tag
```

---

## GitHub Actions

### Release Workflow (`.github/workflows/release.yml`)

**Trigger:** Push to `main` branch

**What it does:**

```yaml
1. Checkout repository
2. Setup Node.js
3. Install dependencies
4. Run changesets action:
   - If changesets exist:
     → Create "Version Packages" PR
   - If Version Packages PR is merged:
     → Create git tag
     → Create GitHub release
     → Existing docker-publish triggers
```

**Permissions:**
- `contents: write` - Create tags and releases
- `pull-requests: write` - Create Version Packages PR

### Docker Publish Workflow (Existing)

**Trigger:** Git tags matching `v*.*.*`

**What it does:**
- Build Docker images (multi-arch)
- Push to GitHub Container Registry
- Create attestations

**No changes needed** - This workflow remains as-is and triggers automatically when release workflow creates tags.

---

## Troubleshooting

### Service Worker Version Mismatch

**Symptom:** `public/sw.js` version doesn't match `package.json`

**Solution:**
```bash
# Manually run the sync script
node scripts/sync-sw-version.cjs

# Verify it worked
grep "const VERSION" public/sw.js
```

**Prevention:** Always use `npm run version-packages` instead of manually editing `package.json`

---

### Changesets Not Creating PR

**Symptom:** Pushed to main, but no "Version Packages" PR appeared

**Check:**
1. Are there changesets in `.changeset/`?
   ```bash
   ls .changeset/*.md
   ```
2. Is GitHub Actions enabled?
3. Check workflow logs in GitHub Actions tab
4. Verify `GITHUB_TOKEN` has proper permissions

---

### Version Bump Is Wrong Type

**Symptom:** Wanted a minor bump, got a patch

**Solution:**
```bash
# Delete the incorrect changeset
rm .changeset/wrong-change.md

# Create a new one with correct type
npx changeset
```

---

### Multiple Changesets for One Release

**This is normal!** Changesets accumulate until you release:

```bash
.changeset/
  feature-a.md  (minor)
  feature-b.md  (minor)
  bugfix-c.md   (patch)

# Result: One minor release (0.0.3 → 0.1.0)
# Changelog includes all three changes
```

---

## Architecture

### File Structure

```
.changeset/
  config.json           # Changesets configuration
  README.md             # Quick reference
  *.md                  # Temporary changeset files (deleted on release)

.github/
  workflows/
    release.yml         # NEW: Release automation
    docker-publish.yml  # EXISTING: Unchanged

scripts/
  sync-sw-version.cjs   # NEW: Service worker version sync
  README.md             # Script documentation

public/
  sw.js                 # Service worker (VERSION auto-updated)

package.json            # Version source of truth
CHANGELOG.md            # Auto-generated
RELEASE_SYSTEM.md       # This file
```

### Version Flow

```
Changeset Created → Stored in .changeset/ → Push to Main → GitHub Actions
                                                                  ↓
                                                    Run: changeset version
                                                                  ↓
                                        Update package.json + CHANGELOG.md
                                                                  ↓
                                                Run: sync-sw-version.cjs
                                                                  ↓
                                                    Update public/sw.js
                                                                  ↓
                                        Commit All → Create Tag → Release
```

---

## Best Practices

### Writing Good Changesets

**Good:**
```markdown
---
"busical": minor
---

Added email history dropdown. Users can now quickly select from previously used email addresses, saving time when setting up calendar syncs.
```

**Bad:**
```markdown
---
"busical": minor
---

Implemented EmailCombobox component with localStorage integration
```

**Why?** The first focuses on user value, the second on implementation details.

---

### When to Create Changesets

**DO create for:**
- ✅ New features users will see
- ✅ Bug fixes affecting users
- ✅ Performance improvements
- ✅ Breaking changes
- ✅ Dependency updates that affect functionality

**DON'T create for:**
- ❌ Refactoring (no user impact)
- ❌ Test updates
- ❌ Documentation changes
- ❌ CI/CD config changes
- ❌ Code formatting

---

### Semantic Versioning Guide

Given a version `MAJOR.MINOR.PATCH` (e.g., `0.0.4`):

| Change Type | When to Use | Example | Version Change |
|-------------|-------------|---------|----------------|
| **patch** | Bug fixes, small tweaks | Fixed Outlook calendar link | 0.0.3 → 0.0.4 |
| **minor** | New features, enhancements | Added email history | 0.0.4 → 0.1.0 |
| **major** | Breaking changes | Removed IE11 support | 0.1.0 → 1.0.0 |

**For this project:** Currently in `0.0.x`, consider moving to `1.0.0` when ready for "stable" release.

---

## References

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- Repository: [dirathea/getbusicalapp](https://github.com/dirathea/getbusicalapp)

---

## Questions?

If you encounter issues not covered here:

1. Check GitHub Actions logs
2. Review the changeset files in `.changeset/`
3. Verify service worker version with `grep "const VERSION" public/sw.js`
4. Check the sync script ran: `node scripts/sync-sw-version.cjs`

---

**Last Updated:** January 12, 2026
**Version:** 1.0
