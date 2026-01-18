const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const packageJson = require('../package.json');
const version = packageJson.version;

console.log(`\n📦 Packaging Chrome Extension v${version}\n`);

try {
  // 1. Install dependencies
  console.log('📥 Installing extension dependencies...');
  execSync('cd extension && npm ci', { stdio: 'inherit' });

  // 2. Build extension
  console.log('\n⚙️  Building extension...');
  execSync('cd extension && npm run build', { stdio: 'inherit' });

  // 3. Verify build output
  console.log('\n🔍 Verifying build output...');
  const distPath = path.join(__dirname, '../extension/dist');
  const requiredFiles = [
    'manifest.json',
    'content.js',
    'content.css',
    'icons/icon16.png',
    'icons/icon48.png',
    'icons/icon128.png'
  ];

  for (const file of requiredFiles) {
    const filePath = path.join(distPath, file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
  console.log('✅ All required files present');

  // 4. Create zip
  console.log('\n📦 Creating zip package...');
  const outputPath = path.join(__dirname, '../extension', `busical-extension-v${version}.zip`);
  
  // Remove old zip if exists
  if (fs.existsSync(outputPath)) {
    fs.unlinkSync(outputPath);
    console.log('   Removed old zip file');
  }

  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    const sizeBytes = archive.pointer();
    const sizeMB = (sizeBytes / 1024 / 1024).toFixed(2);
    console.log(`\n✅ Package created successfully!`);
    console.log(`   Location: extension/busical-extension-v${version}.zip`);
    console.log(`   Size: ${sizeBytes.toLocaleString()} bytes (${sizeMB} MB)`);
    
    // Check Chrome Web Store 5MB limit
    if (sizeBytes > 5242880) {
      console.error('\n❌ Error: Package exceeds 5MB Chrome Web Store limit');
      process.exit(1);
    }

    console.log('\n🎉 Ready to upload to Chrome Web Store!');
    console.log('   Extension ID: kdpkbccpgjddfpbgikagndiipapcfald');
    console.log('   Dashboard: https://chrome.google.com/webstore/devconsole\n');
  });

  output.on('error', (err) => {
    throw err;
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.on('warning', (err) => {
    if (err.code === 'ENOENT') {
      console.warn('⚠️  Warning:', err);
    } else {
      throw err;
    }
  });

  archive.pipe(output);
  
  // Add dist contents to zip (not the dist folder itself)
  archive.directory(distPath, false);
  
  archive.finalize();

} catch (error) {
  console.error('\n❌ Error packaging extension:', error.message);
  process.exit(1);
}
