const VERSION = 'v1.0.0';

// Install event - skip waiting immediately (no caching)
self.addEventListener('install', (event) => {
  console.log(`[SW ${VERSION}] Installing...`);
  self.skipWaiting();
});

// Activate event - claim clients immediately
self.addEventListener('activate', (event) => {
  console.log(`[SW ${VERSION}] Activating...`);
  event.waitUntil(self.clients.claim());
});

// Fetch event - pass through (NO caching, always network)
self.addEventListener('fetch', (event) => {
  // Always fetch from network, no cache fallback
  // This ensures the app always gets fresh data and doesn't work offline
  event.respondWith(fetch(event.request));
});

// Listen for messages from the client (for update handling)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
