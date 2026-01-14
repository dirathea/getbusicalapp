#!/usr/bin/env node

import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, readFileSync } from "fs";

// Get the package directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageRoot = join(__dirname, "..");

// Parse CLI arguments
const args = process.argv.slice(2);
let port = 3000;
let allowedOrigin = "*";

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--port" || args[i] === "-p") {
    port = parseInt(args[i + 1], 10) || 3000;
    i++;
  } else if (args[i] === "--cors" || args[i] === "-c") {
    allowedOrigin = args[i + 1] || "*";
    i++;
  } else if (args[i] === "--help" || args[i] === "-h") {
    console.log(`
BusiCal - Sync calendar events to your work calendar with privacy

Usage: npx @dirathea/busical [options]

Options:
  -p, --port <number>    Port to run the server on (default: 3000)
  -c, --cors <origin>    Allowed CORS origin (default: *)
  -h, --help             Show this help message
  -v, --version          Show version number

Examples:
  npx @dirathea/busical
  npx @dirathea/busical --port 8080
  PORT=3000 npx @dirathea/busical
`);
    process.exit(0);
  } else if (args[i] === "--version" || args[i] === "-v") {
    const pkg = JSON.parse(readFileSync(join(packageRoot, "package.json"), "utf-8"));
    console.log(pkg.version);
    process.exit(0);
  }
}

// Use environment variables as fallback
port = parseInt(process.env.PORT, 10) || port;
allowedOrigin = process.env.ALLOWED_ORIGIN || allowedOrigin;

// Check if dist folder exists
const distPath = join(packageRoot, "dist", "client");
if (!existsSync(distPath)) {
  console.error("Error: dist folder not found. The package may be corrupted.");
  console.error("Please try reinstalling: npm install @dirathea/busical");
  process.exit(1);
}

const app = new Hono();

console.log("Starting BusiCal server...");
console.log(`Port: ${port}`);
console.log(`CORS Origin: ${allowedOrigin}`);

// Enable CORS
app.use(
  "*",
  cors({
    origin: allowedOrigin,
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 86400,
    credentials: false,
  })
);

// Security headers middleware
app.use("*", async (c, next) => {
  await next();
  c.header("X-Content-Type-Options", "nosniff");
  c.header("X-Frame-Options", "DENY");
  c.header("X-XSS-Protection", "1; mode=block");
  c.header("Referrer-Policy", "strict-origin-when-cross-origin");
});

// Strict CSP for proxy endpoint
app.use("/proxy", async (c, next) => {
  await next();
  c.header("Content-Security-Policy", "default-src 'none'; connect-src 'self'");
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Proxy endpoint for ICS files
const handleProxy = async (c, url) => {
  const MAX_ICS_SIZE = 5 * 1024 * 1024; // 5MB

  if (!url) {
    return c.json({ success: false, error: "Missing url parameter" }, 400);
  }

  let urlObj;
  try {
    urlObj = new URL(url);
  } catch {
    return c.json({ success: false, error: "Invalid URL format" }, 400);
  }

  if (!["http:", "https:"].includes(urlObj.protocol)) {
    return c.json({ success: false, error: "Invalid URL protocol. Only http and https are allowed." }, 400);
  }

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "User-Agent": "BusiCal-Proxy/1.0 (Calendar Sync App)",
        Accept: "text/calendar, text/plain, */*",
      },
    });

    const contentLength = response.headers.get("content-length");
    if (contentLength && parseInt(contentLength) > MAX_ICS_SIZE) {
      return c.json({ success: false, error: "Calendar file too large (max 5MB)" }, 413);
    }

    if (!response.ok) {
      return c.json({
        success: false,
        error: "Failed to fetch calendar",
        upstreamStatus: response.status,
        upstreamStatusText: response.statusText,
      }, 502);
    }

    const icsData = await response.text();

    if (icsData.length > MAX_ICS_SIZE) {
      return c.json({ success: false, error: "Calendar file too large (max 5MB)" }, 413);
    }

    if (!icsData.includes("BEGIN:VCALENDAR")) {
      return c.json({ success: false, error: "Response does not appear to be a valid ICS file" }, 400);
    }

    return c.json({
      success: true,
      data: icsData,
      contentType: response.headers.get("content-type") || "text/calendar",
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return c.json({ success: false, error: "Proxy request failed", details: errorMessage }, 500);
  }
};

app.get("/proxy", (c) => handleProxy(c, c.req.query("url")));
app.post("/proxy", async (c) => {
  const body = await c.req.json();
  return handleProxy(c, body.url);
});

// Serve static files from dist directory
app.use("/*", serveStatic({ root: distPath }));

// SPA fallback - serve index.html for unmatched routes
app.get("*", (c) => {
  const indexPath = join(distPath, "index.html");
  if (existsSync(indexPath)) {
    const html = readFileSync(indexPath, "utf-8");
    return c.html(html);
  }
  return c.notFound();
});

// 404 handler
app.notFound((c) => {
  return c.json({ success: false, error: "Not found", path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  return c.json({ success: false, error: "Internal server error", message: err.message }, 500);
});

// Start the server
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`BusiCal server ready on http://localhost:${info.port}`);
});
