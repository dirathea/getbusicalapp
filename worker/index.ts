import { Hono } from 'hono';
import { setup } from './app';

interface Env {
  ALLOWED_ORIGIN?: string;
}

export default {
  fetch: (request: Request, env: Env) => {
    const app = new Hono();
    return setup(app, env).fetch(request);
  },
};
