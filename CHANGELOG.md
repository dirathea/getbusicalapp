# busical

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
