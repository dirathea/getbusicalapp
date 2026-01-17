import { defineConfig } from 'vite';
import { resolve } from 'path';
import { copyFileSync, mkdirSync, existsSync } from 'fs';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/index.ts'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) => {
          // Name CSS file as content.css to match manifest
          if (assetInfo.name?.endsWith('.css')) {
            return 'content.css';
          }
          return '[name].[ext]';
        },
      },
    },
    // Inline all dependencies for content script
    modulePreload: false,
    cssCodeSplit: false,
  },
  // Copy static files to dist
  publicDir: 'public',
  plugins: [
    {
      name: 'copy-manifest',
      writeBundle() {
        // Copy manifest.json to dist
        copyFileSync(
          resolve(__dirname, 'manifest.json'),
          resolve(__dirname, 'dist/manifest.json')
        );
        
        // Ensure icons directory exists in dist
        const iconsDir = resolve(__dirname, 'dist/icons');
        if (!existsSync(iconsDir)) {
          mkdirSync(iconsDir, { recursive: true });
        }
      },
    },
  ],
});
