import { Shield, Lock, Code, Globe, Chrome } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-primary" />
          <h1 className="text-3xl font-bold">Privacy Policy</h1>
        </div>
        <p className="text-muted-foreground">
          Last Updated: January 12, 2025
        </p>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border rounded-lg p-4 space-y-2">
          <Lock className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">No Data Collection</h3>
          <p className="text-xs text-muted-foreground">
            We don't collect, store, or transmit your calendar data.
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-2">
          <Globe className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Local Processing</h3>
          <p className="text-xs text-muted-foreground">
            All data stays in your browser. No external servers involved.
          </p>
        </div>
        
        <div className="border rounded-lg p-4 space-y-2">
          <Code className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Open Source</h3>
          <p className="text-xs text-muted-foreground">
            Fully transparent code. Verify our claims yourself.
          </p>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="border rounded-lg p-6 bg-muted/30">
        <h2 className="text-lg font-semibold mb-3">Table of Contents</h2>
        <nav className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
          <a href="#commitment" className="text-primary hover:underline">Our Commitment</a>
          <a href="#web-app" className="text-primary hover:underline">Web App Privacy</a>
          <a href="#extension" className="text-primary hover:underline">Chrome Extension Privacy</a>
          <a href="#no-collect" className="text-primary hover:underline">Data We Don't Collect</a>
          <a href="#cors-proxy" className="text-primary hover:underline">CORS Proxy</a>
          <a href="#encryption" className="text-primary hover:underline">URL Encryption</a>
          <a href="#browser-data" className="text-primary hover:underline">Browser Data</a>
          <a href="#security" className="text-primary hover:underline">Security Measures</a>
          <a href="#open-source" className="text-primary hover:underline">Open Source</a>
          <a href="#contact" className="text-primary hover:underline">Contact</a>
        </nav>
      </div>

      {/* Main Content */}
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
        
        {/* Our Commitment */}
        <section id="commitment">
          <h2 className="text-2xl font-semibold">Our Commitment</h2>
          <p>
            BusiCal is built with privacy as the foundation. We believe your calendar data is personal 
            and should remain under your control. Whether you use our web app or Chrome extension, 
            privacy comes first.
          </p>
        </section>

        {/* Chrome Extension Privacy */}
        <section id="extension" className="border-l-4 border-primary pl-6 bg-primary/5 p-6 rounded-r-lg">
          <div className="flex items-center gap-2 mb-4">
            <Chrome className="h-6 w-6 text-primary" />
            <h2 className="text-2xl font-semibold m-0">Chrome Extension Privacy</h2>
          </div>
          
          <h3 className="text-lg font-semibold mt-4">What the Extension Accesses</h3>
          <p>
            The BusiCal Chrome extension integrates directly with Google Calendar to provide 
            one-click event sharing. Here's exactly what it accesses and why:
          </p>
          
          <h4 className="text-base font-semibold mt-3">Permissions Explained</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>
              <strong>storage</strong> - Saves your email preferences locally in your browser's 
              storage (up to 5 recent email addresses for quick access). This data never leaves 
              your device.
            </li>
            <li>
              <strong>activeTab</strong> - Allows the extension to interact with the Google 
              Calendar page you're viewing. Only works when you're on calendar.google.com.
            </li>
            <li>
              <strong>calendar.google.com</strong> - Restricts the extension to only work on 
              Google Calendar. Cannot access any other websites or tabs.
            </li>
          </ul>

          <h4 className="text-base font-semibold mt-3">What the Extension Does</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>Reads event details from the Google Calendar page (title, date, time, location)</li>
            <li>Injects "Share to Calendar" buttons into the calendar interface</li>
            <li>Stores your recent email addresses locally for autofill convenience</li>
            <li>Generates calendar links and .ics files locally in your browser</li>
          </ul>

          <h4 className="text-base font-semibold mt-3">What the Extension Does NOT Do</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>❌ Does NOT send your calendar data to any external servers</li>
            <li>❌ Does NOT track your browsing or calendar activity</li>
            <li>❌ Does NOT modify, delete, or create events in your calendar</li>
            <li>❌ Does NOT access calendars other than the one you're viewing</li>
            <li>❌ Does NOT work on any website except calendar.google.com</li>
            <li>❌ Does NOT use analytics or telemetry</li>
          </ul>

          <p className="mt-4 p-4 bg-background border rounded-lg">
            <strong>Privacy Guarantee:</strong> All event processing happens entirely in your browser. 
            The extension is a client-side tool with zero network requests. Your calendar data 
            never leaves your device.
          </p>
        </section>

        {/* Web App Privacy */}
        <section id="web-app">
          <h2 className="text-2xl font-semibold">Web App Privacy</h2>
          <p>
            The BusiCal web app (https://getbusical.app) operates with the same privacy-first principles:
          </p>
        </section>

        {/* Data We Don't Collect */}
        <section id="no-collect">
          <h2 className="text-2xl font-semibold">Data We DO NOT Collect or Store</h2>
          <ul className="list-none space-y-1">
            <li>❌ Calendar URLs (encrypted locally, never transmitted)</li>
            <li>❌ Calendar event data (titles, descriptions, dates, locations)</li>
            <li>❌ Personal information</li>
            <li>❌ Analytics or tracking data</li>
            <li>❌ Cookies (except essential browser localStorage)</li>
            <li>❌ Server-side logs of your requests</li>
            <li>❌ IP addresses</li>
            <li>❌ Usage patterns</li>
          </ul>
        </section>

        {/* How BusiCal Works */}
        <section id="local-storage">
          <h2 className="text-2xl font-semibold">How BusiCal Works</h2>
          
          <h3 className="text-lg font-semibold mt-4">1. Local Storage Only</h3>
          <p>
            All your data is stored exclusively in your browser's localStorage:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Calendar URL (encrypted with AES-256-GCM)</li>
            <li>Cached events (for offline viewing)</li>
            <li>App preferences</li>
            <li>Recent email addresses (Chrome extension only)</li>
          </ul>
          <p>
            This data <strong>never leaves your device</strong> except when fetching calendar updates 
            (web app only, via CORS proxy).
          </p>
        </section>

        {/* CORS Proxy */}
        <section id="cors-proxy">
          <h3 className="text-lg font-semibold mt-4">2. CORS Proxy (Web App Only, Pass-Through)</h3>
          <p>
            <em>Note: The Chrome extension does NOT use the CORS proxy. This section applies only 
            to the web app.</em>
          </p>
          <p>
            Because browsers block direct requests to calendar URLs (CORS restrictions), the web app 
            uses a Cloudflare Worker as a proxy.
          </p>
          
          <h4 className="text-base font-semibold mt-3">What the proxy does:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Receives your calendar URL from your browser</li>
            <li>Fetches the ICS file from your calendar provider</li>
            <li>Immediately returns the data to your browser</li>
            <li><strong>Does nothing else</strong></li>
          </ul>

          <h4 className="text-base font-semibold mt-3">What the proxy does NOT do:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Store your calendar URL</li>
            <li>Save ICS file content</li>
            <li>Log requests or responses</li>
            <li>Retain any data whatsoever</li>
            <li>Share data with third parties</li>
          </ul>

          <p>
            The proxy is a <strong>stateless pass-through</strong> - like a transparent tunnel. 
            Data flows through it but nothing sticks.
          </p>
        </section>

        {/* Calendar Syncing */}
        <section id="syncing">
          <h3 className="text-lg font-semibold mt-4">3. Calendar Syncing</h3>
          <p>
            When you sync an event to your work calendar:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Uses deeplinks (URL schemes) that open your calendar app</li>
            <li>No backend server involved</li>
            <li>No authentication tokens</li>
            <li>Calendar providers (Google, Outlook) handle the actual event creation</li>
            <li>BusiCal never sees if you saved the event or not</li>
          </ul>
        </section>

        {/* Third-Party Services */}
        <section id="third-party">
          <h2 className="text-2xl font-semibold">Third-Party Services</h2>
          
          <h3 className="text-lg font-semibold mt-4">Cloudflare Workers (Web App Proxy)</h3>
          <p>
            Our web app proxy runs on Cloudflare Workers infrastructure. Cloudflare may collect:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Request metadata (timestamp, region, status codes)</li>
            <li>Performance metrics</li>
          </ul>
          <p>
            However, BusiCal's proxy implementation:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Does not log calendar URLs or content</li>
            <li>Does not enable Cloudflare's logging features</li>
            <li>Processes requests in memory only</li>
          </ul>
          <p>
            <strong>Cloudflare's Privacy Policy:</strong>{' '}
            <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              https://www.cloudflare.com/privacypolicy/
            </a>
          </p>

          <h3 className="text-lg font-semibold mt-4">Calendar Providers (Google, Outlook, etc.)</h3>
          <p>
            When you generate your ICS URL from Google Calendar, Outlook, or other providers, 
            and when you sync events back:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>You're subject to their privacy policies</li>
            <li>BusiCal has no control over their data handling</li>
            <li>They may log your access to calendar URLs</li>
            <li>They process calendar event creation when you sync</li>
          </ul>
          <p>
            <strong>You control this:</strong> Regenerate your ICS URL at any time to revoke access.
          </p>
        </section>

        {/* Open Source */}
        <section id="open-source">
          <h2 className="text-2xl font-semibold">Open Source Transparency</h2>
          <p>
            BusiCal is fully open source. You can:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Review the code:{' '}
              <a href="https://github.com/dirathea/getbusicalapp" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://github.com/dirathea/getbusicalapp
              </a>
            </li>
            <li>Verify there's no data collection</li>
            <li>See exactly what the proxy does: <code>worker/app.ts</code></li>
            <li>Check client-side storage: <code>src/lib/storage.ts</code></li>
            <li>Review extension code: <code>extension/src/</code></li>
          </ul>
        </section>

        {/* Self-Hosting */}
        <section id="self-hosting">
          <h2 className="text-2xl font-semibold">Self-Hosting</h2>
          <p>
            Want complete control? Self-host BusiCal:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Deploy your own Cloudflare Worker</li>
            <li>No data ever touches third-party infrastructure</li>
            <li>Full transparency and control</li>
          </ul>
          <p>
            See{' '}
            <a href="https://github.com/dirathea/getbusicalapp/blob/main/DEPLOYMENT.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              DEPLOYMENT.md
            </a>{' '}
            for instructions.
          </p>
        </section>

        {/* Calendar URL Encryption */}
        <section id="encryption">
          <h2 className="text-2xl font-semibold">Calendar URL Encryption</h2>
          <p>
            As of version 0.1.0, the web app automatically encrypts all ICS URLs before storing 
            them in your browser:
          </p>

          <h3 className="text-lg font-semibold mt-4">Encryption Details</h3>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Algorithm:</strong> AES-256-GCM (Advanced Encryption Standard, 256-bit, Galois/Counter Mode)</li>
            <li><strong>Key Derivation:</strong> PBKDF2 with SHA-256, 100,000 iterations</li>
            <li><strong>Key Source:</strong> Device-specific fingerprint (browser characteristics + random salt)</li>
            <li><strong>Storage:</strong> Only encrypted data is stored in localStorage</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">What This Protects Against</h3>
          <ol className="list-decimal list-inside space-y-1">
            <li><strong>Browser Extension Snooping:</strong> Malicious extensions cannot read your URL from storage</li>
            <li><strong>Local Storage Inspection:</strong> Viewing localStorage in DevTools shows only encrypted data</li>
            <li><strong>Physical Device Access:</strong> Unauthorized users cannot retrieve your URL</li>
            <li><strong>Data Export/Theft:</strong> Stolen browser data is useless without the device-specific decryption key</li>
          </ol>

          <h3 className="text-lg font-semibold mt-4">Device-Specific Security</h3>
          <p>
            The encryption key is unique to your device and browser. This means:
          </p>
          <ul className="list-none space-y-1">
            <li>✅ <strong>Better security:</strong> Your URL cannot be decrypted on another device</li>
            <li>⚠️ <strong>Device-specific:</strong> Switching browsers/devices requires re-entering your URL</li>
            <li>ℹ️ <strong>No cloud sync:</strong> Encrypted URLs cannot be synced across devices</li>
          </ul>

          <h3 className="text-lg font-semibold mt-4">Browser Compatibility</h3>
          <p>
            BusiCal requires the Web Crypto API for encryption. Supported browsers:
          </p>
          <ul className="list-none space-y-1">
            <li>✅ Chrome 37+ (2014)</li>
            <li>✅ Firefox 34+ (2014)</li>
            <li>✅ Safari 11+ (2017)</li>
            <li>✅ Edge 79+ (2020)</li>
          </ul>
        </section>

        {/* Browser Data */}
        <section id="browser-data">
          <h2 className="text-2xl font-semibold">Browser Data</h2>
          <p>
            Data stored in your browser's localStorage:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              <strong>Calendar URL and cached events</strong> - For offline viewing and quick access
            </li>
            <li>
              <strong>Email history</strong> - Up to 5 recent email addresses per calendar platform 
              (Google/Outlook) - Chrome extension only
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1 text-sm">
                <li>Used to pre-fill email when syncing events</li>
                <li><strong>Stored locally only in your browser, never transmitted to any server</strong></li>
                <li>Can be removed individually (X button in dropdown) or cleared via browser settings</li>
                <li>Google and Outlook email histories are stored separately</li>
              </ul>
            </li>
          </ul>
          <p>
            <strong>Control:</strong> You can clear this data anytime via browser settings. Individual 
            emails can be removed from history using the X button in the email dropdown (extension).
          </p>
          <p>
            <strong>Scope:</strong> Only accessible to BusiCal running on the same domain.
          </p>
          <p>
            <strong>Persistence:</strong> Survives browser restarts but can be cleared by you at any time.
          </p>
        </section>

        {/* Security Measures */}
        <section id="security">
          <h2 className="text-2xl font-semibold">Security Measures</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>HTTPS only (encrypted connections)</li>
            <li>URL validation (prevents malicious requests)</li>
            <li>SSRF attack prevention</li>
            <li>Content validation (must be valid ICS format)</li>
            <li>File size limits (max 5MB)</li>
            <li>Security headers (X-Frame-Options, CSP, etc.)</li>
            <li>No authentication tokens stored</li>
            <li>Rate limiting (Cloudflare configuration)</li>
            <li>Minimal extension permissions (only what's necessary)</li>
            <li>No background scripts or network requests in extension</li>
          </ul>
        </section>

        {/* Changes to Policy */}
        <section id="changes">
          <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
          <p>
            If we ever need to change this policy, we'll:
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>Update this document with a new "Last Updated" date</li>
            <li>Notify users via GitHub release notes</li>
            <li>Maintain previous versions for transparency</li>
          </ul>
        </section>

        {/* Contact */}
        <section id="contact">
          <h2 className="text-2xl font-semibold">Contact</h2>
          <p>
            Questions or concerns?
          </p>
          <ul className="list-disc list-inside space-y-1">
            <li>
              GitHub Issues:{' '}
              <a href="https://github.com/dirathea/getbusicalapp/issues" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://github.com/dirathea/getbusicalapp/issues
              </a>
            </li>
            <li>
              Open a discussion:{' '}
              <a href="https://github.com/dirathea/getbusicalapp/discussions" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                https://github.com/dirathea/getbusicalapp/discussions
              </a>
            </li>
          </ul>
        </section>

        {/* Summary */}
        <section id="summary" className="border-t pt-6">
          <h2 className="text-2xl font-semibold">Summary (TL;DR)</h2>
          <ul className="list-disc list-inside space-y-1">
            <li>Your data stays in your browser (both web app and extension)</li>
            <li>Extension processes everything locally - zero network requests</li>
            <li>Web app proxy is a pass-through, stores nothing</li>
            <li>No tracking, no analytics, no logs</li>
            <li>Open source - verify yourself</li>
            <li>Self-host for complete control</li>
          </ul>
        </section>

      </div>
    </div>
  );
}
