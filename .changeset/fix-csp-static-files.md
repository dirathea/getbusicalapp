---
"busical": patch
---

Fix CSP blocking static files in Docker deployment

- Move strict CSP header from global middleware to /proxy endpoint only
- Remove frame-ancestors from meta tag (only works via HTTP header)
- Static files now use permissive CSP from index.html meta tag
- X-Frame-Options: DENY header still protects against clickjacking
