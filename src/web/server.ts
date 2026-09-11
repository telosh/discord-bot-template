import { Hono, type Context } from 'hono';
import { env } from '../config/env.js';
import { logger } from '../infra/logger.js';
import { getSiteConfig, buildLoginUrl, handleOAuthCallback, requireSession } from './auth.js';
import { registerActivityRoutes } from './activity.js';
import { readFile } from 'node:fs/promises';
import { dirname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Client } from 'discord.js';

const WEB_DIST_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', 'web', 'dist');

const CONTENT_TYPES: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

async function serveAdmin(c: Context, subpath: string): Promise<Response> {
  return serveStaticDir(c, WEB_DIST_ROOT, subpath, new Set(['index.html']));
}

async function serveStaticDir(
  c: Context,
  root: string,
  subpath: string,
  fallbacks: Set<string>,
): Promise<Response> {
  const normalized = normalize(subpath).replace(/^(\.\.[/\\])+/, '');
  const candidates =
    normalized === '' ? ['index.html'] : [normalized, `${normalized}/index.html`, ...fallbacks];
  for (const candidate of candidates) {
    const full = join(root, candidate);
    if (!full.startsWith(root + sep) && !fallbacks.has(candidate)) {
      continue;
    }
    try {
      const body = await readFile(full);
      const ext = candidate.slice(candidate.lastIndexOf('.'));
      return new Response(body, {
        headers: { 'Content-Type': CONTENT_TYPES[ext] ?? 'application/octet-stream' },
      });
    } catch {
      continue;
    }
  }
  return c.text('not found', 404);
}

export function createWebApp(client: Client): Hono {
  const app = new Hono();
  const api = new Hono();

  api.onError((error, c) => {
    logger.error({ error }, 'Web API error');
    return c.json({ error: 'internal' }, 500);
  });

  // Register API routes before mounting
  api.get('/site-config', (c) => c.json(getSiteConfig()));
  registerActivityRoutes(api, client);

  api.get('/me', async (c) => {
    const session = await requireSession(c);
    if (!session) return c.json({ error: 'unauthorized' }, 401);
    return c.json({
      id: session.userId,
      username: session.username,
      guilds: session.guilds.map((id) => ({
        id,
        name: client.guilds.cache.get(id)?.name ?? id,
      })),
    });
  });

  // Mount API under both /api and / to support Discord Activity proxy
  app.route('/api', api);
  app.route('/', api);

  app.get('/health', (c) => c.json({ ok: true }));

  app.get('/auth/login', async (c) => {
    if (!env.SESSION_SECRET || !env.DISCORD_CLIENT_SECRET || !env.OAUTH_REDIRECT_URI) {
      return c.text('OAuth not configured', 503);
    }
    const login = await buildLoginUrl(c);
    return c.redirect(login.url);
  });

  app.get('/auth/callback', async (c) => {
    if (!env.SESSION_SECRET || !env.DISCORD_CLIENT_SECRET || !env.OAUTH_REDIRECT_URI) {
      return c.text('OAuth not configured', 503);
    }
    const code = c.req.query('code');
    const state = c.req.query('state') ?? '';
    if (!code) return c.text('Missing code', 400);
    const result = await handleOAuthCallback(c, client, code, state);
    if (!result.ok) {
      return c.text(result.reason, result.status);
    }
    return c.redirect('/');
  });

  app.get('/', (c) => serveAdmin(c, ''));
  app.get('/admin', (c) => serveAdmin(c, ''));
  app.get('/admin/*', (c) => serveAdmin(c, c.req.path.slice('/admin/'.length)));
  app.get('/activity', (c) => serveAdmin(c, 'activity.html'));

  return app;
}
