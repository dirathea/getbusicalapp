---
"busical": patch
---

Remove frame-ancestors from CSP meta tag

The `frame-ancestors` directive is ignored when delivered via a `<meta>` element
and only works via HTTP header. This was causing a console warning.
Clickjacking protection is already handled by `X-Frame-Options: DENY` header
in the worker middleware.
