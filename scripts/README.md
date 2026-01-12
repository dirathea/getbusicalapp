# Scripts Documentation

## sync-sw-version.cjs

Synchronizes the service worker version with the package.json version.

> Note: This script uses the `.cjs` extension because the project uses ES modules (`"type": "module"` in package.json).

### Purpose

Keeps `public/sw.js` version in sync with `package.json` during version bumps.

### How It Works

1. Reads the `version` field from `package.json`
2. Finds the `const VERSION = 'v...'` line in `public/sw.js`
3. Replaces it with the current package version
4. Writes the updated file back

### Usage

Automatically run as part of `npm run version-packages`:

```bash
npm run version-packages
# Internally runs: changeset version && node scripts/sync-sw-version.cjs
```

Can also be run manually:

```bash
node scripts/sync-sw-version.cjs
# Output: ✅ Updated service worker version to v0.0.4
```

### Example

**Before** (package.json):
```json
{
  "version": "0.0.4"
}
```

**Before** (public/sw.js):
```javascript
const VERSION = 'v0.0.3';
```

**After running script** (public/sw.js):
```javascript
const VERSION = 'v0.0.4';
```

### Error Handling

- If `package.json` is not found: Script exits with error
- If `public/sw.js` is not found: Script exits with error
- If VERSION pattern not found: Script exits with error

### Code

```javascript
const fs = require('fs');
const path = require('path');

const packageJson = require('../package.json');
const swPath = path.join(__dirname, '../public/sw.js');

let swContent = fs.readFileSync(swPath, 'utf8');

// Replace the VERSION line
swContent = swContent.replace(
  /const VERSION = ['"]v[\d.]+['"];/,
  `const VERSION = 'v${packageJson.version}';`
);

fs.writeFileSync(swPath, swContent, 'utf8');
console.log(`✅ Updated service worker version to v${packageJson.version}`);
```

### Why Not Build-Time Injection?

We considered using Vite's `define` feature to inject the version at build time, but chose the script approach because:

- ✅ No build configuration changes needed
- ✅ Service worker stays in `public/` (simpler PWA setup)
- ✅ Version is visible in source control (easier debugging)
- ✅ Atomic commits (version change + SW update together)
- ✅ No additional dependencies

See `RELEASE_SYSTEM.md` for more details on this decision.
