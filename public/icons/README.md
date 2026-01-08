# App Icons

## TODO: Generate PNG Icons

You need to generate PNG icons from the SVG:

### Using Online Tool:
1. Go to https://realfavicongenerator.net/
2. Upload `icon.svg`
3. Generate icons for:
   - 192x192 as `icon-192.png`
   - 512x512 as `icon-512.png`
4. Place them in this directory

### Using ImageMagick (if installed):
```bash
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
```

### Using Node.js (sharp):
```bash
npm install -g sharp-cli
sharp -i icon.svg -o icon-192.png resize 192 192
sharp -i icon.svg -o icon-512.png resize 512 512
```

For now, the app will work without icons, but PWA installation will require them.
