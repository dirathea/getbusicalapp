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
