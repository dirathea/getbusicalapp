---
"@dirathea/busical": patch
---

Fix 404 errors for SPA routes in search engine crawlers

- Configure Cloudflare Workers to only process API routes (/proxy, /health)
- Non-API routes now served directly by static assets with SPA fallback
- Add robots.txt to guide search engine crawlers
- Add sitemap.xml for better SEO indexing
- Remove conflicting notFound handler from Hono app

This resolves 404 errors reported by Google Search Console for /faq and /about pages while maintaining compatibility with both Cloudflare Workers and Docker/Node.js deployments.
