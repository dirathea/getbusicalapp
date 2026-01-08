import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  Bindings: Record<string, string>;
  Variables: Record<string, unknown>;
}

const app = new Hono<{ Bindings: Env['Bindings'] }>();

// Enable CORS for all routes
app.use('*', cors({
  origin: '*', // Allow all origins. Restrict as needed for production
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'User-Agent'],
  exposeHeaders: ['Content-Length', 'Content-Type'],
  maxAge: 86400, // 24 hours
  credentials: false,
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET endpoint for ICS proxy (primary method)
app.get('/proxy', async (c) => {
  try {
    const url = c.req.query('url');

    if (!url) {
      return c.json({ 
        success: false,
        error: 'Missing url query parameter' 
      }, 400);
    }

    // Validate URL to prevent SSRF attacks
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return c.json({ 
        success: false,
        error: 'Invalid URL format' 
      }, 400);
    }

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return c.json({ 
        success: false,
        error: 'Invalid URL protocol. Only http and https are allowed.' 
      }, 400);
    }

    // Fetch the ICS file
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SnapCal-Proxy/1.0 (Calendar Sync App)',
        'Accept': 'text/calendar, text/plain, */*',
      },
    });

    if (!response.ok) {
      return c.json({
        success: false,
        error: 'Failed to fetch calendar',
        upstreamStatus: response.status,
        upstreamStatusText: response.statusText,
      }, 502); // Bad Gateway
    }

    // Get the ICS data as plain text
    const icsData = await response.text();

    // Validate that we got ICS-like content
    if (!icsData.includes('BEGIN:VCALENDAR')) {
      return c.json({
        success: false,
        error: 'Response does not appear to be a valid ICS file',
      }, 400);
    }

    // Return success with ICS data
    return c.json({
      success: true,
      data: icsData,
      contentType: response.headers.get('content-type') || 'text/calendar',
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error:', errorMessage);
    return c.json({ 
      success: false,
      error: 'Proxy request failed', 
      details: errorMessage 
    }, 500);
  }
});

// POST endpoint for ICS proxy (alternative method)
app.post('/proxy', async (c) => {
  try {
    const body = await c.req.json();
    const { url } = body;

    if (!url) {
      return c.json({ 
        success: false,
        error: 'Missing url parameter' 
      }, 400);
    }

    // Validate URL
    let urlObj: URL;
    try {
      urlObj = new URL(url);
    } catch {
      return c.json({ 
        success: false,
        error: 'Invalid URL format' 
      }, 400);
    }

    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return c.json({ 
        success: false,
        error: 'Invalid URL protocol' 
      }, 400);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SnapCal-Proxy/1.0',
        'Accept': 'text/calendar, text/plain, */*',
      },
    });

    if (!response.ok) {
      return c.json({
        success: false,
        error: 'Failed to fetch calendar',
        upstreamStatus: response.status,
        upstreamStatusText: response.statusText,
      }, 502); // Bad Gateway
    }

    const icsData = await response.text();

    if (!icsData.includes('BEGIN:VCALENDAR')) {
      return c.json({
        success: false,
        error: 'Response does not appear to be a valid ICS file',
      }, 400);
    }

    return c.json({
      success: true,
      data: icsData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Proxy error:', errorMessage);
    return c.json({ 
      success: false,
      error: 'Proxy request failed', 
      details: errorMessage 
    }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ 
    success: false,
    error: 'Not found', 
    path: c.req.path 
  }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Worker error:', err);
  return c.json({ 
    success: false,
    error: 'Internal server error', 
    message: err.message 
  }, 500);
});

export default app;
