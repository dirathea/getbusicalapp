# 🐳 SnapCal Docker Deployment Guide

This guide covers self-hosting SnapCal using Docker for complete privacy and control over your calendar data.

## Table of Contents
- [Quick Start](#quick-start)
- [Using Docker Compose](#using-docker-compose)
- [Configuration](#configuration)
- [Building from Source](#building-from-source)
- [Production Deployment](#production-deployment)
- [Platform Support](#platform-support)
- [Health Check](#health-check)
- [Troubleshooting](#troubleshooting)
- [Version Tags](#version-tags)

---

## Quick Start

### Prerequisites
- Docker 20.10+ installed
- 256MB RAM minimum, 512MB recommended
- 100MB disk space

### Pull and Run

Pull the latest image from GitHub Container Registry:

```bash
docker pull ghcr.io/dirathea/snapcal:latest
```

Run the container:

```bash
docker run -d \
  -p 3000:3000 \
  -e CORS_ORIGIN="*" \
  --name snapcal \
  --restart unless-stopped \
  ghcr.io/dirathea/snapcal:latest
```

Access the app at: **http://localhost:3000**

---

## Using Docker Compose

### 1. Create docker-compose.yml

```yaml
version: '3.9'

services:
  snapcal:
    image: ghcr.io/dirathea/snapcal:latest
    container_name: snapcal
    ports:
      - "3000:3000"
    environment:
      - PORT=3000
      - CORS_ORIGIN=*
      - NODE_ENV=production
    restart: unless-stopped
```

### 2. Start the Service

```bash
docker-compose up -d
```

### 3. View Logs

```bash
docker-compose logs -f snapcal
```

### 4. Stop the Service

```bash
docker-compose down
```

---

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Port the server listens on |
| `CORS_ORIGIN` | `*` | Allowed CORS origins. Use `*` for all origins or specify your domain |
| `NODE_ENV` | `production` | Runtime environment |

### Examples

**Allow specific domain:**
```bash
docker run -d \
  -p 3000:3000 \
  -e CORS_ORIGIN="https://snapcal.example.com" \
  --name snapcal \
  ghcr.io/dirathea/snapcal:latest
```

**Custom port:**
```bash
docker run -d \
  -p 8080:3000 \
  --name snapcal \
  ghcr.io/dirathea/snapcal:latest
```

---

## Building from Source

### Clone the Repository

```bash
git clone https://github.com/dirathea/snapcal.git
cd snapcal
```

### Build the Image

```bash
docker build -t snapcal:local .
```

### Run Your Local Build

```bash
docker run -p 3000:3000 snapcal:local
```

### Using npm Scripts

```bash
# Build the image
npm run docker:build

# Run the image
npm run docker:run

# Development mode (with rebuild)
npm run docker:dev

# Production mode (detached)
npm run docker:prod

# Stop containers
npm run docker:stop

# View logs
npm run docker:logs
```

---

## Production Deployment

### With Reverse Proxy (Recommended)

#### Using Nginx

```nginx
server {
    listen 80;
    server_name snapcal.example.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### Using Caddy

```caddyfile
snapcal.example.com {
    reverse_proxy localhost:3000
}
```

### With HTTPS

Use a reverse proxy like Caddy (automatic HTTPS) or nginx with Let's Encrypt:

**docker-compose.yml with Caddy:**

```yaml
version: '3.9'

services:
  snapcal:
    image: ghcr.io/dirathea/snapcal:latest
    container_name: snapcal
    environment:
      - CORS_ORIGIN=https://snapcal.example.com
    restart: unless-stopped
    networks:
      - web

  caddy:
    image: caddy:2-alpine
    container_name: caddy
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
      - caddy_config:/config
    restart: unless-stopped
    networks:
      - web

networks:
  web:

volumes:
  caddy_data:
  caddy_config:
```

### Security Best Practices

1. **Set specific CORS origin:**
   ```yaml
   environment:
     - CORS_ORIGIN=https://your-domain.com
   ```

2. **Use HTTPS in production:**
   - Set up a reverse proxy with SSL/TLS
   - Use Let's Encrypt for free certificates

3. **Keep the image updated:**
   ```bash
   docker pull ghcr.io/dirathea/snapcal:latest
   docker-compose up -d
   ```

4. **Monitor logs:**
   ```bash
   docker-compose logs -f snapcal
   ```

5. **Enable firewall rules:**
   - Only expose necessary ports
   - Use Docker network isolation

---

## Platform Support

SnapCal Docker images support multiple architectures:

- **linux/amd64** - Standard x86_64 systems
- **linux/arm64** - ARM 64-bit (Apple Silicon, AWS Graviton, etc.)
- **linux/arm/v7** - ARM 32-bit (Raspberry Pi 3/4)

Docker automatically pulls the correct image for your platform.

### Raspberry Pi Deployment

SnapCal works great on Raspberry Pi 3/4:

```bash
# Pull the image (automatically selects arm/v7 or arm64)
docker pull ghcr.io/dirathea/snapcal:latest

# Run with minimal resources
docker run -d \
  -p 3000:3000 \
  --memory="256m" \
  --cpus="0.5" \
  --name snapcal \
  --restart unless-stopped \
  ghcr.io/dirathea/snapcal:latest
```

---

## Health Check

The container includes a built-in health check:

```bash
# Check container health
docker ps

# Manual health check
curl http://localhost:3000/health

# Expected response:
# {"status":"ok","timestamp":"2026-01-10T..."}
```

---

## Troubleshooting

### Container won't start

Check logs:
```bash
docker logs snapcal
```

### Port already in use

Change the host port:
```bash
docker run -d -p 8080:3000 --name snapcal ghcr.io/dirathea/snapcal:latest
```

### CORS errors

Set the correct origin:
```bash
docker run -d \
  -e CORS_ORIGIN="https://your-domain.com" \
  -p 3000:3000 \
  --name snapcal \
  ghcr.io/dirathea/snapcal:latest
```

### PWA not installing

1. Ensure you're using HTTPS (required for PWA)
2. Check service worker registration in browser console
3. Verify static files are being served correctly

### Image pull fails

Try with explicit tag:
```bash
docker pull ghcr.io/dirathea/snapcal:v0.0.1
```

### Out of memory on Raspberry Pi

Increase memory limit:
```bash
docker run -d \
  --memory="512m" \
  -p 3000:3000 \
  --name snapcal \
  ghcr.io/dirathea/snapcal:latest
```

---

## Version Tags

Images are tagged with:
- `latest` - Latest stable release from main branch
- `v0.0.1`, `v0.0.2`, etc. - Specific versions
- `0.0`, `0` - Major/minor version tags
- `sha-<commit>` - Specific commit builds

Example:
```bash
# Latest release
docker pull ghcr.io/dirathea/snapcal:latest

# Specific version
docker pull ghcr.io/dirathea/snapcal:v0.0.1

# Specific commit
docker pull ghcr.io/dirathea/snapcal:sha-abc123
```

---

## Support

- **Issues:** https://github.com/dirathea/snapcal/issues
- **Discussions:** https://github.com/dirathea/snapcal/discussions
- **Documentation:** https://github.com/dirathea/snapcal

---

## License

SnapCal is open source software, licensed as per the repository.

---

# ☁️ Cloudflare Workers Deployment Guide

This guide covers deploying SnapCal to Cloudflare Pages + Workers for a serverless, global deployment.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Security Configuration](#security-configuration)
- [Rate Limiting Setup](#rate-limiting-setup)
- [Deployment](#deployment)
- [Monitoring](#monitoring)

---

## Prerequisites

- Cloudflare account (free tier works!)
- Node.js 18+ installed
- npm or yarn package manager
- GitHub repository (for automatic deployments)

---

## Initial Setup

### 1. Clone and Install

```bash
git clone https://github.com/dirathea/snapcal.git
cd snapcal
npm install
```

### 2. Login to Cloudflare

```bash
npx wrangler login
```

This will open your browser to authenticate with Cloudflare.

### 3. Update wrangler.jsonc

Edit `wrangler.jsonc` and update the name if needed:

```jsonc
{
  "name": "snapcal-yourname",  // Change this to avoid conflicts
  "compatibility_date": "2025-04-03",
  // ... rest of config
}
```

---

## Security Configuration

### Environment Variables

Set the `ALLOWED_ORIGIN` environment variable to restrict CORS access:

#### Development (wrangler.jsonc)

Already configured in `wrangler.jsonc`:
```jsonc
{
  "vars": {
    "ALLOWED_ORIGIN": "http://localhost:5174"
  }
}
```

#### Production (Cloudflare Dashboard)

1. Go to **Workers & Pages** → Your worker → **Settings** → **Variables**
2. Add environment variable:
   - **Name:** `ALLOWED_ORIGIN`
   - **Value:** `https://your-production-domain.com`
3. Click **"Save"**
4. Redeploy worker

#### Using Wrangler CLI

```bash
wrangler secret put ALLOWED_ORIGIN
# Enter value: https://your-production-domain.com
```

**Important:** Set this to your actual domain in production, not `*` wildcard!

---

## Rate Limiting Setup

Protect your proxy from abuse with Cloudflare Rate Limiting:

### Option 1: WAF Rate Limiting Rules (Recommended)

1. Go to **Cloudflare Dashboard** → Your domain → **Security** → **WAF**
2. Click **"Create rule"** under Rate Limiting Rules
3. Configure:
   - **Rule name:** Proxy Rate Limit
   - **When incoming requests match:**
     - Field: `URI Path`
     - Operator: `contains`
     - Value: `/proxy`
   - **With the same characteristics:**
     - Field: `IP Address`
   - **Choose action:**
     - **Requests:** `60` per `1 minute`
     - **Action:** Block
     - **Duration:** `1 hour`
4. Click **"Deploy"**

### Recommended Limits

- **Personal use:** 60 requests/minute per IP
- **Team use:** 300 requests/minute per IP
- **Public instance:** 30 requests/minute per IP with stricter duration

### Option 2: Workers Built-in Rate Limiting

For more granular control, you can implement rate limiting in the Worker code using:
- Cloudflare Workers KV
- Durable Objects
- Rate Limiting API

See [Cloudflare Workers Rate Limiting Guide](https://developers.cloudflare.com/workers/examples/rate-limiting/).

---

## Deployment

### Method 1: Manual Deployment (Quick)

```bash
# Build the project
npm run build

# Deploy to Cloudflare
npx wrangler pages deploy dist/client
```

Follow the prompts to create a new project or select existing.

### Method 2: Automatic Deployment via GitHub (Recommended)

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Connect to Cloudflare Pages:**
   - Go to **Cloudflare Dashboard** → **Pages**
   - Click **"Create a project"**
   - Connect your GitHub repository
   - Select **snapcal** repository

3. **Configure Build Settings:**
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist/client`
   - **Root directory:** `/`

4. **Add Environment Variables:**
   - Click **"Environment variables"**
   - Add `ALLOWED_ORIGIN` with your production domain

5. **Deploy:**
   - Click **"Save and Deploy"**
   - Wait for build to complete (~2 minutes)

### Method 3: Using Wrangler

```bash
# Deploy with wrangler
npx wrangler pages deploy dist/client --project-name snapcal
```

---

## Security Headers

The proxy includes security headers by default:
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy: default-src 'none'`

No additional configuration needed.

---

## Monitoring

### No Logs Policy

The proxy **does not log** calendar URLs or content for privacy.

### What You Can Monitor (via Cloudflare Dashboard)

Access: **Workers & Pages** → Your worker → **Metrics**

Available metrics:
- Request count (total proxy requests)
- Error rates (5xx responses)
- Response times (p50, p95, p99)
- Bandwidth usage

**Metrics do NOT include:**
- Calendar URLs
- ICS file content  
- Personal data

### Setting Up Alerts

1. Go to **Notifications** in Cloudflare Dashboard
2. Create alert for:
   - High error rate (>5%)
   - Unusual request spike
   - Worker exceptions

---

## Privacy Best Practices

### For Self-Hosters

1. ✅ **Set strict ALLOWED_ORIGIN** - don't use wildcard `*` in production
2. ✅ **Enable rate limiting** - prevent abuse
3. ✅ **Regular updates** - keep worker code up to date
4. ✅ **Monitor metrics** - watch for unusual patterns
5. ✅ **Document for users** - if hosting for others, provide privacy policy

### For Users

1. ✅ **Use self-hosted instance** - if privacy is critical
2. ✅ **Regenerate ICS URLs periodically** - from your calendar provider
3. ✅ **Use read-only calendar URLs** - never share write-access URLs
4. ✅ **Clear browser data** - if switching devices or concerned about local storage

---

## Troubleshooting

### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
1. Verify `ALLOWED_ORIGIN` environment variable is set correctly
2. Ensure value matches your app's domain exactly (including `https://`)
3. Redeploy worker after changing environment variables

```bash
# Check current environment variables
npx wrangler pages deployment list

# Update via dashboard or:
wrangler secret put ALLOWED_ORIGIN
```

### Rate Limit Exceeded

**Error:** `429 Too Many Requests`

**Cause:** Too many requests from same IP

**Solution:**
1. Check Cloudflare WAF Rate Limiting rules
2. Adjust limits if legitimate use case
3. Wait for rate limit window to reset (typically 1 hour)
4. Consider increasing limits for your IP

### File Size Errors

**Error:** `413 Payload Too Large`

**Cause:** Calendar file exceeds 5MB limit

**Solution:**
1. Export smaller date range from calendar provider
2. Remove old events from calendar
3. Split calendar into multiple ICS feeds

### Deployment Fails

**Error:** Build fails or deployment errors

**Solution:**
```bash
# Clear build cache
rm -rf dist/ node_modules/.vite

# Reinstall dependencies
npm clean-install

# Rebuild
npm run build

# Redeploy
npx wrangler pages deploy dist/client
```

### Worker Not Updating

**Issue:** Changes not reflected after deployment

**Solution:**
1. Clear Cloudflare cache: **Dashboard** → **Caching** → **Purge Everything**
2. Hard refresh browser (Ctrl+Shift+R or Cmd+Shift+R)
3. Check deployment status in **Pages** dashboard
4. Wait 1-2 minutes for global propagation

---

## Custom Domain Setup

### Add Custom Domain to Pages

1. Go to **Pages** → Your project → **Custom domains**
2. Click **"Set up a custom domain"**
3. Enter your domain: `snapcal.yourdomain.com`
4. Follow DNS instructions (usually CNAME record)
5. Wait for SSL certificate (automatic, ~10 minutes)

### Update ALLOWED_ORIGIN

After adding custom domain, update environment variable:

```bash
wrangler secret put ALLOWED_ORIGIN
# Enter: https://snapcal.yourdomain.com
```

Or via dashboard:
**Workers & Pages** → Settings → Variables → Edit `ALLOWED_ORIGIN`

---

## Cost Estimate

Cloudflare Workers Free Tier:
- ✅ **100,000 requests/day** - Free
- ✅ **10ms CPU time/request** - Free
- ✅ **Unlimited bandwidth** - Free (for workers)
- ✅ **SSL certificate** - Free

**Estimated usage:**
- Personal use (~10 users): **Free**
- Small team (~50 users): **Free**
- Medium org (~500 users): **Free** (within limits)

**Paid tier ($5/month) needed only if:**
- >100k requests/day
- Need Workers Analytics
- Need longer CPU time

---

## Support

- **Issues:** https://github.com/dirathea/snapcal/issues
- **Discussions:** https://github.com/dirathea/snapcal/discussions  
- **Privacy Policy:** [PRIVACY.md](PRIVACY.md)
- **Cloudflare Docs:** https://developers.cloudflare.com/workers/

---

## Next Steps

After deployment:
1. ✅ Set `ALLOWED_ORIGIN` to your production domain
2. ✅ Configure rate limiting rules
3. ✅ Set up monitoring alerts
4. ✅ Test calendar fetching
5. ✅ Review [Privacy Policy](PRIVACY.md)
6. ✅ Share with your team!

