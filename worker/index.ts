import { Hono } from 'hono';
import { setup } from './app';

interface Env {
  Bindings: Record<string, string>;
  Variables: Record<string, unknown>;
}

const app = new Hono<{ Bindings: Env['Bindings'] }>();

export default setup(app);
