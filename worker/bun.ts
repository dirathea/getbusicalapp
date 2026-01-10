import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { setup } from "./app";

const app = new Hono();

// Get configuration from environment variables
const port = parseInt(process.env.PORT || "3000", 10);
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

console.log("🚀 Starting SnapCal server...");
console.log(`📡 Port: ${port}`);
console.log(`🔒 CORS Origin: ${allowedOrigin}`);

// Setup API routes with CORS configuration
setup(app, { ALLOWED_ORIGIN: allowedOrigin });

// Serve static files from dist directory
// This will serve any file that exists in dist/
app.use(
  "/*",
  serveStatic({
    root: "./dist",
  })
);

// SPA fallback - serve index.html for any route that doesn't match
// an API endpoint or static file
app.get(
  "*",
  serveStatic({
    path: "./dist/index.html",
  })
);

console.log(`✅ SnapCal server ready on http://localhost:${port}`);

// Export Bun server configuration
export default {
  port,
  fetch: app.fetch,
};
