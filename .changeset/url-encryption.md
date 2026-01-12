---
"busical": minor
---

Add automatic URL encryption for enhanced security

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
