const fs = require('fs');
const path = require('path');

// Read package.json version
const packageJson = require('../package.json');
const swPath = path.join(__dirname, '../public/sw.js');

try {
  // Read service worker file
  let swContent = fs.readFileSync(swPath, 'utf8');

  // Replace the VERSION line
  const versionRegex = /const VERSION = ['"]v[\d.]+['"];/;
  const newVersion = `const VERSION = 'v${packageJson.version}';`;

  if (!versionRegex.test(swContent)) {
    console.error('❌ Error: Could not find VERSION constant in public/sw.js');
    console.error('   Expected pattern: const VERSION = \'v0.0.0\';');
    process.exit(1);
  }

  swContent = swContent.replace(versionRegex, newVersion);

  // Write updated service worker
  fs.writeFileSync(swPath, swContent, 'utf8');

  console.log(`✅ Updated service worker version to v${packageJson.version}`);
} catch (error) {
  console.error('❌ Error updating service worker version:', error.message);
  process.exit(1);
}
