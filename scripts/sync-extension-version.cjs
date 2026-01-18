const fs = require('fs');
const path = require('path');

// Read main package.json version
const packageJson = require('../package.json');
const version = packageJson.version;

// Paths
const manifestPath = path.join(__dirname, '../extension/manifest.json');
const extPackagePath = path.join(__dirname, '../extension/package.json');

try {
  // Update extension manifest.json
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const oldManifestVersion = manifest.version;
  manifest.version = version;
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated extension/manifest.json: ${oldManifestVersion} → ${version}`);

  // Update extension package.json
  const extPackage = JSON.parse(fs.readFileSync(extPackagePath, 'utf8'));
  const oldPackageVersion = extPackage.version;
  extPackage.version = version;
  fs.writeFileSync(extPackagePath, JSON.stringify(extPackage, null, 2) + '\n', 'utf8');
  console.log(`✅ Updated extension/package.json: ${oldPackageVersion} → ${version}`);

  console.log(`\n🎉 Extension version synced to ${version}`);

} catch (error) {
  console.error('❌ Error updating extension versions:', error.message);
  process.exit(1);
}
