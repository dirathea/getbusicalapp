# Changesets

This directory contains changesets - descriptions of changes that will be included in the next release.

## Creating a Changeset

When you make a user-facing change (new feature, bug fix, etc.), create a changeset:

```bash
npx changeset
```

You'll be prompted to:
1. Select the package(s) to bump (usually just "busical")
2. Choose the change type:
   - **major** - Breaking changes (0.x.0 → 1.0.0)
   - **minor** - New features (0.0.x → 0.1.0)
   - **patch** - Bug fixes (0.0.3 → 0.0.4)
3. Write a user-friendly summary of the change

## Example Changeset

```markdown
---
"busical": minor
---

Added email history dropdown that shows previously used email addresses. Users can now quickly select from their history instead of typing their email each time.
```

## Tips

- **Write for users**, not developers
- Focus on **what changed** and **why it matters**
- Be concise but clear
- Multiple changesets can accumulate before release

## What Happens Next

1. You commit the changeset file: `git add .changeset && git commit -m "feat: ..."`
2. Push to main: `git push`
3. GitHub Actions creates a "Version Packages" PR
4. When merged, a release is created automatically
5. Your changeset description appears in the CHANGELOG and GitHub release

## More Info

See `RELEASE_SYSTEM.md` for complete documentation.

---

For official Changesets documentation, visit [github.com/changesets/changesets](https://github.com/changesets/changesets)
