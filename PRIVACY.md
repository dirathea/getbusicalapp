# Privacy Policy

**Last Updated:** January 2026

## Our Commitment

SnapCal is built with privacy as the foundation. We believe your calendar data is personal and should remain under your control.

## Data We DO NOT Collect or Store

- ❌ Calendar URLs
- ❌ Calendar event data (titles, descriptions, dates, locations)
- ❌ Personal information
- ❌ Analytics or tracking data
- ❌ Cookies (except essential browser localStorage)
- ❌ Server-side logs of your requests
- ❌ IP addresses
- ❌ Usage patterns

## How SnapCal Works

### 1. Local Storage Only

All your data is stored exclusively in your browser's localStorage:
- Calendar URL (your choice to save it)
- Cached events (for offline viewing)
- App preferences

This data **never leaves your device** except when fetching calendar updates.

### 2. CORS Proxy (Pass-Through Only)

Because browsers block direct requests to calendar URLs (CORS restrictions), SnapCal uses a Cloudflare Worker as a proxy.

**What the proxy does:**
- Receives your calendar URL from your browser
- Fetches the ICS file from your calendar provider
- Immediately returns the data to your browser
- **Does nothing else**

**What the proxy does NOT do:**
- Store your calendar URL
- Save ICS file content
- Log requests or responses
- Retain any data whatsoever
- Share data with third parties

The proxy is a **stateless pass-through** - like a transparent tunnel. Data flows through it but nothing sticks.

### 3. Calendar Syncing

When you sync an event to your work calendar:
- Uses deeplinks (URL schemes) that open your calendar app
- No backend server involved
- No authentication tokens
- Calendar providers (Google, Outlook) handle the actual event creation
- SnapCal never sees if you saved the event or not

## Third-Party Services

### Cloudflare Workers (Proxy Infrastructure)

Our proxy runs on Cloudflare Workers infrastructure. Cloudflare may collect:
- Request metadata (timestamp, region, status codes)
- Performance metrics

However, SnapCal's proxy implementation:
- Does not log calendar URLs or content
- Does not enable Cloudflare's logging features
- Processes requests in memory only

**Cloudflare's Privacy Policy:** https://www.cloudflare.com/privacypolicy/

### Calendar Providers (Google, Outlook, etc.)

When you generate your ICS URL from Google Calendar, Outlook, or other providers, and when you sync events back:
- You're subject to their privacy policies
- SnapCal has no control over their data handling
- They may log your access to calendar URLs
- They process calendar event creation when you sync

**You control this:** Regenerate your ICS URL at any time to revoke access.

## Open Source Transparency

SnapCal is fully open source. You can:
- Review the code: https://github.com/dirathea/snapcal
- Verify there's no data collection
- See exactly what the proxy does: `worker/app.ts`
- Check client-side storage: `src/lib/storage.ts`

## Self-Hosting

Want complete control? Self-host SnapCal:
- Deploy your own Cloudflare Worker
- No data ever touches third-party infrastructure
- Full transparency and control

See [DEPLOYMENT.md](DEPLOYMENT.md) for instructions.

## Browser Data

Data stored in your browser's localStorage:
- **Purpose:** Save your calendar URL and cache events for offline viewing
- **Control:** You can clear this anytime via browser settings or the app's "Clear Data" button
- **Scope:** Only accessible to SnapCal running on the same domain
- **Persistence:** Survives browser restarts but can be cleared by you

## Security Measures

- HTTPS only (encrypted connections)
- URL validation (prevents malicious requests)
- SSRF attack prevention
- Content validation (must be valid ICS format)
- File size limits (max 5MB)
- Security headers (X-Frame-Options, CSP, etc.)
- No authentication tokens stored
- Rate limiting (Cloudflare configuration)

## Changes to This Policy

If we ever need to change this policy, we'll:
- Update this document with a new "Last Updated" date
- Notify users via GitHub release notes
- Maintain previous versions for transparency

## Contact

Questions or concerns?
- GitHub Issues: https://github.com/dirathea/snapcal/issues
- Open a discussion: https://github.com/dirathea/snapcal/discussions

## Summary

**TL;DR:**
- Your data stays in your browser
- Proxy is a pass-through, stores nothing
- No tracking, no analytics, no logs
- Open source - verify yourself
- Self-host for complete control
