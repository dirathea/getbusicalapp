import { Hono } from "hono";
import { cors } from "hono/cors";

interface Env {
  ALLOWED_ORIGIN?: string;
}

interface SetupConfig extends Env {
  corsOrigin?: string;
}

const setup = <T extends Hono = Hono>(app: T, env?: Env): T => {
  // Get allowed origin from environment variable or fallback to wildcard for dev
  const allowedOrigin = env?.ALLOWED_ORIGIN || "*";

  // Enable CORS for all routes
  app.use(
    "*",
    cors({
      origin: allowedOrigin,
      allowMethods: ["GET", "POST", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization", "Accept", "User-Agent"],
      exposeHeaders: ["Content-Length", "Content-Type"],
      maxAge: 86400, // 24 hours
      credentials: false,
    })
  );

  // Security headers middleware (applied to all routes)
  app.use("*", async (c, next) => {
    await next();

    // Prevent MIME type sniffing
    c.header('X-Content-Type-Options', 'nosniff');

    // Prevent clickjacking
    c.header('X-Frame-Options', 'DENY');

    // Enable XSS protection
    c.header('X-XSS-Protection', '1; mode=block');

    // Referrer policy
    c.header('Referrer-Policy', 'strict-origin-when-cross-origin');

    // Note: CSP for static files is handled by index.html meta tag
  });

  // Strict CSP for proxy endpoint only (API responses don't need scripts/styles)
  app.use("/proxy", async (c, next) => {
    await next();
    c.header('Content-Security-Policy', "default-src 'none'; connect-src 'self'");
  });

  // Health check endpoint
  app.get("/health", (c) => {
    return c.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // GET endpoint for ICS proxy (primary method)
  app.get("/proxy", async (c) => {
    try {
      const url = c.req.query("url");

      if (!url) {
        return c.json(
          {
            success: false,
            error: "Missing url query parameter",
          },
          400
        );
      }

      // Validate URL to prevent SSRF attacks
      let urlObj: URL;
      try {
        urlObj = new URL(url);
      } catch {
        return c.json(
          {
            success: false,
            error: "Invalid URL format",
          },
          400
        );
      }

      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return c.json(
          {
            success: false,
            error: "Invalid URL protocol. Only http and https are allowed.",
          },
          400
        );
      }

      // Fetch the ICS file
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "BusiCal-Proxy/1.0 (Calendar Sync App)",
          Accept: "text/calendar, text/plain, */*",
        },
      });

      // Check file size limit (5MB max)
      const MAX_ICS_SIZE = 5 * 1024 * 1024; // 5MB
      const contentLength = response.headers.get('content-length');
      
      if (contentLength && parseInt(contentLength) > MAX_ICS_SIZE) {
        return c.json(
          {
            success: false,
            error: "Calendar file too large (max 5MB)",
          },
          413 // Payload Too Large
        );
      }

      if (!response.ok) {
        return c.json(
          {
            success: false,
            error: "Failed to fetch calendar",
            upstreamStatus: response.status,
            upstreamStatusText: response.statusText,
          },
          502
        ); // Bad Gateway
      }

      // Get the ICS data as plain text
      const icsData = await response.text();

      // Double-check actual size (in case Content-Length header was missing)
      if (icsData.length > MAX_ICS_SIZE) {
        return c.json(
          {
            success: false,
            error: "Calendar file too large (max 5MB)",
          },
          413
        );
      }

      // Validate that we got ICS-like content
      if (!icsData.includes("BEGIN:VCALENDAR")) {
        return c.json(
          {
            success: false,
            error: "Response does not appear to be a valid ICS file",
          },
          400
        );
      }

      // Return success with ICS data
      return c.json({
        success: true,
        data: icsData,
        contentType: response.headers.get("content-type") || "text/calendar",
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      // No logging - privacy first
      return c.json(
        {
          success: false,
          error: "Proxy request failed",
          details: errorMessage,
        },
        500
      );
    }
  });

  // POST endpoint for ICS proxy (alternative method)
  app.post("/proxy", async (c) => {
    try {
      const body = await c.req.json();
      const { url } = body;

      if (!url) {
        return c.json(
          {
            success: false,
            error: "Missing url parameter",
          },
          400
        );
      }

      // Validate URL
      let urlObj: URL;
      try {
        urlObj = new URL(url);
      } catch {
        return c.json(
          {
            success: false,
            error: "Invalid URL format",
          },
          400
        );
      }

      if (!["http:", "https:"].includes(urlObj.protocol)) {
        return c.json(
          {
            success: false,
            error: "Invalid URL protocol",
          },
          400
        );
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "User-Agent": "BusiCal-Proxy/1.0",
          Accept: "text/calendar, text/plain, */*",
        },
      });

      // Check file size limit (5MB max)
      const MAX_ICS_SIZE = 5 * 1024 * 1024; // 5MB
      const contentLength = response.headers.get('content-length');
      
      if (contentLength && parseInt(contentLength) > MAX_ICS_SIZE) {
        return c.json(
          {
            success: false,
            error: "Calendar file too large (max 5MB)",
          },
          413 // Payload Too Large
        );
      }

      if (!response.ok) {
        return c.json(
          {
            success: false,
            error: "Failed to fetch calendar",
            upstreamStatus: response.status,
            upstreamStatusText: response.statusText,
          },
          502
        ); // Bad Gateway
      }

      const icsData = await response.text();

      // Double-check actual size
      if (icsData.length > MAX_ICS_SIZE) {
        return c.json(
          {
            success: false,
            error: "Calendar file too large (max 5MB)",
          },
          413
        );
      }

      if (!icsData.includes("BEGIN:VCALENDAR")) {
        return c.json(
          {
            success: false,
            error: "Response does not appear to be a valid ICS file",
          },
          400
        );
      }

      return c.json({
        success: true,
        data: icsData,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      // No logging - privacy first
      return c.json(
        {
          success: false,
          error: "Proxy request failed",
          details: errorMessage,
        },
        500
      );
    }
  });

  // 404 handler
  app.notFound((c) => {
    return c.json(
      {
        success: false,
        error: "Not found",
        path: c.req.path,
      },
      404
    );
  });

  // Error handler
  app.onError((err, c) => {
    // No logging - privacy first
    return c.json(
      {
        success: false,
        error: "Internal server error",
        message: err.message,
      },
      500
    );
  });

  return app;
};

export { setup };