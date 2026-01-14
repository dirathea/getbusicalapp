import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import { setup } from "./app.js";

const app = new Hono();

const port = parseInt(process.env.PORT || "3000", 10);
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";

console.log("Starting BusiCal server...");
console.log(`Port: ${port}`);
console.log(`CORS Origin: ${allowedOrigin}`);

setup(app, { ALLOWED_ORIGIN: allowedOrigin });

// Serve static files from dist/client directory
app.use("/*", serveStatic({ root: "./dist/client" }));

// SPA fallback
app.get("*", serveStatic({ path: "./dist/client/index.html" }));

serve({ fetch: app.fetch, port }, (info) => {
  console.log(`BusiCal server ready on http://localhost:${info.port}`);
});
