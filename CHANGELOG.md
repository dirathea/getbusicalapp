# busical

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
