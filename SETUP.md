# SnapCal Setup Guide

## Initial Setup (Completed ✅)

The application has been fully implemented and is ready to use!

## What's Been Built

### ✅ Core Features
- ICS URL input with validation
- Calendar event parsing using ical.js
- Week toggle (This Week / Next Week)
- Event list with date grouping
- Event details dialog
- Sync to Google Calendar, Outlook, or System Calendar
- Privacy-first event syncing ("Synced Event", marked as busy)

### ✅ Technical Implementation
- React 19 + TypeScript
- shadcn/ui components
- localStorage for data persistence
- Responsive mobile-first design
- PWA manifest and meta tags

### ✅ Files Created
```
22 new files created:
- 1 TypeScript interfaces file
- 6 library/utility files
- 2 custom hooks
- 7 React components
- 1 main App.tsx
- 3 PWA files (manifest, index.html, icon.svg)
- 2 documentation files
```

## Next Steps

### 1. Generate App Icons (Required for PWA)

The app needs PNG icons for PWA installation:

**Option A: Using Online Tool (Easiest)**
1. Go to https://realfavicongenerator.net/
2. Upload `public/icons/icon.svg`
3. Download and extract icons
4. Save as:
   - `public/icons/icon-192.png` (192x192)
   - `public/icons/icon-512.png` (512x512)

**Option B: Using ImageMagick**
```bash
cd public/icons
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
```

**Option C: Using Node.js (sharp)**
```bash
npm install -g sharp-cli
cd public/icons
sharp -i icon.svg -o icon-192.png resize 192 192
sharp -i icon.svg -o icon-512.png resize 512 512
```

### 2. Test the Application

The dev server is running at `http://localhost:5173`

**Test Flow:**
1. Open the app in your browser
2. Click "How to get ICS URL" to see instructions
3. Get an ICS URL from your calendar (Google Calendar, Outlook, etc.)
4. Paste the URL and click "Load Events"
5. Toggle between "This Week" and "Next Week"
6. Click an event to view details
7. Click "Sync to Calendar" and choose a platform
8. Verify the deeplink or .ics download works

**Test on Mobile:**
1. Access the app from your phone (use your local IP)
2. Test PWA installation (Add to Home Screen)
3. Test .ics download (should open system calendar)
4. Test Google Calendar / Outlook deeplinks

### 3. Deploy to Production

**Option A: Vercel (Recommended)**
```bash
npm install -g vercel
vercel
```

**Option B: Netlify**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

**Option C: GitHub Pages**
```bash
npm run build
# Push dist/ folder to gh-pages branch
```

**Important for Production:**
- Must use HTTPS (PWA requirement)
- Update manifest.json with production URL
- Test PWA installation on mobile devices

### 4. Customize (Optional)

**Update Branding:**
- Change app name in `public/manifest.json`
- Update colors in manifest and index.html
- Customize the icon in `public/icons/icon.svg`

**Update Theme:**
- Your existing theme is already applied
- No changes needed unless you want to adjust colors

## Testing Checklist

### Desktop (Chrome/Firefox/Safari)
- [ ] ICS URL input and validation works
- [ ] Events load and parse correctly
- [ ] Week toggle switches between weeks
- [ ] Event cards display properly
- [ ] Event details dialog opens
- [ ] Sync dialog works for all platforms
- [ ] Google Calendar deeplink opens
- [ ] Outlook Calendar deeplink opens
- [ ] .ics file downloads

### Mobile (iOS Safari / Android Chrome)
- [ ] Responsive layout looks good
- [ ] ICS URL input works
- [ ] Events list scrolls smoothly
- [ ] Touch targets are large enough
- [ ] Dialogs display correctly
- [ ] Google Calendar app opens (if installed)
- [ ] Outlook app opens (if installed)
- [ ] .ics triggers system calendar picker
- [ ] PWA installs correctly ("Add to Home Screen")
- [ ] PWA opens in standalone mode

### Edge Cases
- [ ] Invalid ICS URL shows error
- [ ] Empty calendar shows "No events" message
- [ ] Network error is handled gracefully
- [ ] Very long event titles truncate properly
- [ ] All-day events display correctly
- [ ] Events with no location/description work
- [ ] Multiple events on same day group correctly
- [ ] Refresh button re-fetches events
- [ ] localStorage persists ICS URL

## Troubleshooting

### Build fails with TypeScript errors
```bash
npm run build
# Check the error messages and fix type issues
```

### Icons don't load
- Generate PNG icons from icon.svg
- Verify files exist at `public/icons/icon-192.png` and `icon-512.png`

### Calendar doesn't parse
- Verify ICS URL is accessible
- Check browser console for errors
- Try a different ICS source
- Ensure URL uses https:// (not webcal://)

### Deeplinks don't work
- Verify user is logged into Google/Outlook in browser
- Check browser console for errors
- Test with a different email address

### PWA won't install
- Ensure running on HTTPS (or localhost)
- Generate required PNG icons
- Check manifest.json is accessible
- Verify all PWA requirements in DevTools

## Known Issues & Workarounds

**Issue**: Google Calendar can't set event as "private" via deeplink
**Workaround**: User must manually change privacy after sync

**Issue**: Can't verify if event was actually saved
**Workaround**: User must check their calendar manually

**Issue**: Recurring events may not parse correctly
**Workaround**: Each occurrence is treated as separate event

## Next Features to Add

Priority features for future development:
1. Custom date range picker (beyond 2 weeks)
2. Bulk sync (select multiple events)
3. Customizable event titles (instead of "Synced Event")
4. Sync history (track which events synced)
5. Service worker for offline support
6. Dark mode toggle

## Support

If you encounter issues:
1. Check the browser console (F12)
2. Clear localStorage and try again
3. Verify ICS URL in a browser
4. Test with a different calendar source

## Success!

Your SnapCal app is ready to use! 🎉

The dev server is running at: http://localhost:5173

Start testing by:
1. Getting an ICS URL from your calendar
2. Loading events in the app
3. Syncing an event to test the flow
