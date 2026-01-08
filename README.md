# SnapCal 📅

A privacy-first Progressive Web App (PWA) that helps you sync personal calendar events to your work calendar without exposing sensitive details.

## Features

- **Privacy-First**: Events sync as "Synced Event" marked as busy to protect your privacy
- **No Authentication Required**: Uses calendar deeplinks - no OAuth, no backend
- **Multiple Platforms**: Sync to Google Calendar, Outlook Calendar, or download .ics files
- **Week View Toggle**: View events for this week or next week
- **Offline-Capable**: PWA with localStorage caching
- **Mobile-Friendly**: Fully responsive design that works on iOS and Android

## Quick Start

### Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:5173`

## How It Works

1. **Add Your Calendar**: Enter your source calendar's ICS URL (from Google Calendar, Outlook, iCloud, etc.)
2. **View Events**: Browse events for this week or next week
3. **Sync**: Click any event to sync it to your work calendar
4. **Choose Platform**: Select Google Calendar, Outlook, or download .ics file
5. **Privacy Protected**: Event syncs with minimal details ("Synced Event", marked as busy)

## Getting Your ICS URL

### Google Calendar
1. Open Google Calendar on the web
2. Click Settings (gear icon) → Settings
3. Select your calendar from the left sidebar
4. Scroll to "Integrate calendar" section
5. Copy the "Secret address in iCalendar format" URL

### Outlook.com
1. Open Outlook Calendar on the web
2. Click Settings → View all Outlook settings
3. Go to Calendar → Shared calendars
4. Under "Publish a calendar", select your calendar
5. Click "Publish" and copy the ICS link

### Apple Calendar (iCloud)
1. Open iCloud.com and go to Calendar
2. Click the share icon next to your calendar
3. Enable "Public Calendar"
4. Copy the URL
5. Replace "webcal://" with "https://" in the URL

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **UI Components**: shadcn/ui (Tailwind CSS + Radix UI)
- **Calendar Parsing**: ical.js (Mozilla)
- **Date Handling**: date-fns
- **Storage**: localStorage (client-side only)
- **PWA**: Web App Manifest

## Project Structure

```
src/
├── components/          # React components
│   ├── ui/             # shadcn/ui components (DO NOT MODIFY)
│   ├── Header.tsx
│   ├── IcsInput.tsx
│   ├── EventList.tsx
│   ├── EventCard.tsx
│   ├── EventDetailsDialog.tsx
│   ├── SyncDialog.tsx
│   └── WeekToggle.tsx
├── lib/                # Core utilities
│   ├── icsParser.ts    # ICS fetching and parsing
│   ├── calendarLinks.ts # Deeplink generation
│   ├── icsGenerator.ts # .ics file generation
│   ├── storage.ts      # localStorage management
│   ├── dateUtils.ts    # Date formatting and filtering
│   └── utils.ts        # General utilities
├── hooks/              # React hooks
│   ├── useIcsData.ts   # Main data management hook
│   └── useLocalStorage.ts
├── types/              # TypeScript types
│   └── index.ts
├── App.tsx             # Main app component
└── main.tsx            # Entry point
```

## PWA Setup

### Manifest
The app includes a `manifest.json` for PWA installation. Update the theme colors in:
- `public/manifest.json`
- `index.html` (theme-color meta tag)

### Icons
You need to generate PNG icons for PWA installation:

**Required:**
- `public/icons/icon-192.png` (192x192px)
- `public/icons/icon-512.png` (512x512px)

**Generate from SVG:**
```bash
# Using ImageMagick
convert public/icons/icon.svg -resize 192x192 public/icons/icon-192.png
convert public/icons/icon.svg -resize 512x512 public/icons/icon-512.png

# Or use https://realfavicongenerator.net/
```

## Privacy & Security

- **No Server**: All data stays on your device
- **No Tracking**: No analytics or external tracking
- **No OAuth**: No authentication tokens stored
- **HTTPS Required**: For PWA functionality
- **Event Privacy**: Synced events show minimal information

## Limitations

- **No OAuth**: Users must be logged into Google/Outlook in their browser
- **No Private Flag**: Can't set Google Calendar events as "private" via deeplink
- **No Sync Confirmation**: Can't verify if user actually saved the event
- **Week Range Only**: Shows only this week and next week events
- **Client-Side Only**: All processing happens in browser

## Browser Support

- **Desktop**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Android Chrome 90+
- **PWA**: Requires HTTPS (works on localhost for development)

## Development Notes

### UI Components
The `src/components/ui/` directory is managed by shadcn CLI. **DO NOT MODIFY** these files manually. To add or update components:

```bash
npx shadcn@latest add [component-name]
```

### Environment
- Development runs on `http://localhost:5173`
- PWA features require HTTPS in production
- localStorage is used for all data persistence

## Future Enhancements

- [ ] Custom date range selection
- [ ] Bulk sync (multiple events at once)
- [ ] Sync history tracking
- [ ] Customizable event titles
- [ ] Support for recurring events
- [ ] Dark mode toggle
- [ ] Multiple calendar sources
- [ ] Service worker for offline support
- [ ] Background sync

## Contributing

Contributions are welcome! Please follow these guidelines:
1. Keep the existing code style
2. Don't modify `src/components/ui/` manually (use shadcn CLI)
3. Test on both desktop and mobile
4. Update this README if adding features

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify ICS URL is valid and accessible
3. Ensure you're using a modern browser
4. Try clearing localStorage and refreshing

## Acknowledgments

- [ical.js](https://github.com/mozilla-comm/ical.js) by Mozilla
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [date-fns](https://date-fns.org/) for date manipulation
- [Lucide Icons](https://lucide.dev/) for icons
