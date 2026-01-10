# Stage 1: Build the frontend application
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 2: Production runtime with Bun
# Platform support: linux/amd64, linux/arm64
# Note: ARM 32-bit (armv7) is not supported by oven/bun:1-alpine
# For 32-bit ARM devices, use 64-bit OS or deploy via Cloudflare Workers
FROM oven/bun:1-alpine AS runtime

WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S bunjs -u 1001 -G nodejs

# Copy built assets from builder
COPY --from=builder --chown=bunjs:nodejs /app/dist ./dist
COPY --from=builder --chown=bunjs:nodejs /app/worker ./worker
COPY --from=builder --chown=bunjs:nodejs /app/package.json ./

# Install only Hono (production dependency for worker)
RUN bun install --production

# Set environment variables with secure defaults
ENV PORT=3000 \
    CORS_ORIGIN=* \
    NODE_ENV=production

# Switch to non-root user
USER bunjs

# Expose the application port
EXPOSE 3000

# Add health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun -e "try { const r = await fetch('http://localhost:3000/health'); process.exit(r.ok ? 0 : 1); } catch { process.exit(1); }" || exit 1

# Set labels for metadata
LABEL org.opencontainers.image.title="SnapCal" \
      org.opencontainers.image.description="Sync calendar events to your work calendar privately" \
      org.opencontainers.image.source="https://github.com/dirathea/snapcal" \
      org.opencontainers.image.licenses="MIT"

# Start the application
CMD ["bun", "run", "worker/bun.ts"]
