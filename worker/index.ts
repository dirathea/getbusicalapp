import { Hono } from 'hono';
import { setup } from './app';

interface Env {
  ALLOWED_ORIGIN?: string;
  ASSETS: { fetch: typeof fetch };
}

// Define which paths should be handled by the API worker
// All other paths will be served as static assets with SPA fallback
const API_PATHS = ['/proxy', '/health'];

export default {
  fetch: async (request: Request, env: Env) => {
    const url = new URL(request.url);
    
    // Only handle API routes with Hono
    // This allows SPA routes like /faq, /about to be served by static asset handling
    const isApiRoute = API_PATHS.some(path => url.pathname.startsWith(path));
    
    if (isApiRoute) {
      const app = new Hono();
      return setup(app, env).fetch(request);
    }
    
    // For all other routes, let Cloudflare serve static assets
    // This will use the "not_found_handling": "single-page-application" setting
    // from wrangler.jsonc to serve index.html for SPA routes
    return env.ASSETS.fetch(request);
  },
};
