import { Hono } from 'hono';
import { setup } from './app';

interface Env {
  ALLOWED_ORIGIN?: string;
}

export default {
  async fetch(request, env, ctx) {
    const app = new Hono();
    return setup(app, env).fetch(request);
  },
};
