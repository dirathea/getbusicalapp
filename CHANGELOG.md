# busical

## 0.3.0

### Minor Changes

- [#38](https://github.com/dirathea/getbusicalapp/pull/38) [`4ca9bb1`](https://github.com/dirathea/getbusicalapp/commit/4ca9bb1a2fa03637af303fbdc06cc958a189425e) Thanks [@dirathea](https://github.com/dirathea)! - Fix Google Calendar URL validation and worker proxy routing

## 0.2.1

### Patch Changes

- [#36](https://github.com/dirathea/getbusicalapp/pull/36) [`22debe7`](https://github.com/dirathea/getbusicalapp/commit/22debe799f55d330985ea81362a007bdae980c1c) Thanks [@dirathea](https://github.com/dirathea)! - Fix 404 errors for SPA routes in search engine crawlers

  - Configure Cloudflare Workers to only process API routes (/proxy, /health)
  - Non-API routes now served directly by static assets with SPA fallback
  - Add robots.txt to guide search engine crawlers
  - Add sitemap.xml for better SEO indexing
  - Remove conflicting notFound handler from Hono app

  This resolves 404 errors reported by Google Search Console for /faq and /about pages while maintaining compatibility with both Cloudflare Workers and Docker/Node.js deployments.

## 0.2.0

### Minor Changes

- [#34](https://github.com/dirathea/getbusicalapp/pull/34) [`fcc8518`](https://github.com/dirathea/getbusicalapp/commit/fcc8518bce5d23a5fabf65b1c953f7c2fed232f1) Thanks [@dirathea](https://github.com/dirathea)! - Add Chrome extension for sharing Google Calendar events to other calendars

  - Chrome MV3 extension that injects share button into Google Calendar event popups
  - Support for Google Calendar and Outlook Calendar deeplinks
  - Privacy-preserving: events sync as "Synced Event" marked busy
  - Email history stored locally via chrome.storage
  - Vanilla JS implementation matching Google Calendar's UI style
  - New npm scripts: `extension:install`, `extension:dev`, `extension:build`

## 0.1.6

### Patch Changes

- [#31](https://github.com/dirathea/getbusicalapp/pull/31) [`30090f3`](https://github.com/dirathea/getbusicalapp/commit/30090f398b3e2df0f47f4b36b06d36817de3de7c) Thanks [@dirathea](https://github.com/dirathea)! - ci: trigger Docker build from release workflow instead of tag push

## 0.1.5

### Patch Changes

- [#29](https://github.com/dirathea/getbusicalapp/pull/29) [`e271034`](https://github.com/dirathea/getbusicalapp/commit/e271034815e2f25a279e5266364f7eef34abc308) Thanks [@dirathea](https://github.com/dirathea)! - fix: update to Node 24/npm 11 and fix npm OIDC publishing configuration

## 0.1.4

### Patch Changes

- [#27](https://github.com/dirathea/getbusicalapp/pull/27) [`4a6d5ca`](https://github.com/dirathea/getbusicalapp/commit/4a6d5cacb965f505867fe249a2110665a814c259) Thanks [@dirathea](https://github.com/dirathea)! - Switch npm publishing to use OIDC authentication instead of static tokens for improved security.

## 0.1.3

### Patch Changes

- [#25](https://github.com/dirathea/getbusicalapp/pull/25) [`9decd8f`](https://github.com/dirathea/getbusicalapp/commit/9decd8faaf8315a63bad0ca7ffeb9e1b4a114317) Thanks [@dirathea](https://github.com/dirathea)! - Release Manually

## 0.1.2

### Patch Changes

- [#23](https://github.com/dirathea/getbusicalapp/pull/23) [`d25c923`](https://github.com/dirathea/getbusicalapp/commit/d25c923c2a703eb770e1508ec3e0cc4a41eb9627) Thanks [@dirathea](https://github.com/dirathea)! - Fix GitHub releases not being created by changesets workflow

  Added `createGithubReleases: true` to the changesets action configuration.
  This is required for private packages since they don't publish to npm,
  and GitHub releases were only created after successful npm publishes.

## 0.1.1

### Patch Changes

- [#21](https://github.com/dirathea/getbusicalapp/pull/21) [`e8c155f`](https://github.com/dirathea/getbusicalapp/commit/e8c155f727d3c441f5376062123b1133102a5bb6) Thanks [@dirathea](https://github.com/dirathea)! - Remove frame-ancestors from CSP meta tag

  The `frame-ancestors` directive is ignored when delivered via a `<meta>` element
  and only works via HTTP header. This was causing a console warning.
  Clickjacking protection is already handled by `X-Frame-Options: DENY` header
  in the worker middleware.

## 0.1.0

### Minor Changes

- [#16](https://github.com/dirathea/getbusicalapp/pull/16) [`43dfb60`](https://github.com/dirathea/getbusicalapp/commit/43dfb605ec872affe507797bd2cece26e06615e3) Thanks [@dirathea](https://github.com/dirathea)! - Add automatic URL encryption for enhanced security

  - Implement AES-256-GCM encryption for ICS URLs stored in localStorage
  - Add device-specific fingerprinting for encryption keys
  - Mask URLs in UI to show only domain with security indicator
  - Add "Reveal URL" button for viewing stored URLs when editing
  - Implement strict Content Security Policy headers for XSS protection
  - Add Web Crypto API detection with graceful error messaging
  - Lazy migration from plain-text URLs to encrypted format
  - Update privacy documentation with encryption details
  - Block app on unsupported browsers (pre-2015)

  This is a breaking change for users on very old browsers, but provides significant security improvements for the vast majority of users.

## 0.0.4

### Patch Changes

- Implemented automated release system with Changesets. Service worker version now automatically syncs with package.json version, and releases are managed through user-friendly changesets instead of manual version bumps.
