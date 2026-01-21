import { Hono } from 'hono';
import { setup } from './app';

interface Env {
  ALLOWED_ORIGIN?: string;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Only handle API routes with Hono worker
    // Let everything else fall through to static assets
    if (url.pathname.startsWith('/proxy') || url.pathname.startsWith('/health')) {
      const app = new Hono();
      return setup(app, env).fetch(request);
    }
    
    // For non-API routes, fetch from assets
    // @ts-ignore - ASSETS is available in the Workers Assets environment
    return env.ASSETS.fetch(request);
  },
};
