import { Hono } from 'hono';
import { cors } from 'hono/cors';

interface Env {
  Bindings: Record<string, string>;
  Variables: Record<string, unknown>;
}

const app = new Hono<{ Bindings: Env['Bindings'] }>();

// Enable CORS for all routes
app.use('*', cors({
  origin: '*', // Allow all origins. Restrict as needed: ['https://example.com']
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH', 'HEAD'],
  allowHeaders: ['Content-Type', 'Authorization', 'Accept', 'User-Agent'],
  exposeHeaders: ['Content-Length', 'X-Total-Count'],
  maxAge: 86400, // 24 hours
  credentials: false, // Set to true if allowing credentials with specific origins
}));

// Health check endpoint
app.get('/health', (c) => {
  return c.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Main proxy endpoint
app.post('/proxy', async (c) => {
  try {
    const body = await c.req.json();
    const { url, method = 'GET', headers = {}, data } = body;

    if (!url) {
      return c.json({ error: 'Missing url parameter' }, 400);
    }

    // Validate URL to prevent SSRF attacks
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return c.json({ error: 'Invalid URL protocol' }, 400);
    }

    const requestOptions: RequestInit = {
      method: method.toUpperCase(),
      headers: {
        'User-Agent': 'SnapCal-Proxy',
        ...headers,
      },
    };

    if (data && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      requestOptions.body = typeof data === 'string' ? data : JSON.stringify(data);
    }

    const response = await fetch(url, requestOptions);
    const responseData = await response.text();

    // Try to parse as JSON, fallback to text
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    return c.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: parsedData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Proxy request failed', details: errorMessage }, 500);
  }
});

// Proxy GET requests
app.get('/proxy', async (c) => {
  try {
    const url = c.req.query('url');

    if (!url) {
      return c.json({ error: 'Missing url query parameter' }, 400);
    }

    // Validate URL to prevent SSRF attacks
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return c.json({ error: 'Invalid URL protocol' }, 400);
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'SnapCal-Proxy',
      },
    });

    const responseData = await response.text();

    // Try to parse as JSON, fallback to text
    let parsedData: unknown;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    return c.json({
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: parsedData,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Proxy request failed', details: errorMessage }, 500);
  }
});

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not found', path: c.req.path }, 404);
});

// Error handler
app.onError((err, c) => {
  console.error('Worker error:', err);
  return c.json({ error: 'Internal server error', message: err.message }, 500);
});

export default app;
