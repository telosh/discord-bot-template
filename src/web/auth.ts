import type { Context } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { createHmac, randomBytes } from 'node:crypto';
import type { Client } from 'discord.js';
import { env } from '../config/env.js';

const OAUTH_STATE_COOKIE = 'oauth_state';
const SESSION_COOKIE = 'session';

export interface Session {
  userId: string;
  username: string;
  guilds: string[];
}

export function getSiteConfig() {
  return {
    inviteUrl: `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&permissions=2147483648&scope=bot%20applications.commands`,
    clientId: env.DISCORD_CLIENT_ID,
    redirectUri: env.OAUTH_REDIRECT_URI ?? '',
  };
}

function sign(value: string): string {
  if (!env.SESSION_SECRET) throw new Error('SESSION_SECRET is not set');
  return createHmac('sha256', env.SESSION_SECRET).update(value).digest('hex');
}

function encodeSession(session: Session): string {
  const payload = Buffer.from(JSON.stringify(session)).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

function decodeSession(token: string): Session | undefined {
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return undefined;
  if (sign(payload) !== signature) return undefined;
  try {
    return JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
  } catch {
    return undefined;
  }
}

export async function buildLoginUrl(c: Context): Promise<{ url: string }> {
  const state = randomBytes(16).toString('hex');
  setCookie(c, OAUTH_STATE_COOKIE, state, {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 10,
    path: '/',
  });

  const redirectUri = encodeURIComponent(env.OAUTH_REDIRECT_URI ?? '');
  const scope = encodeURIComponent('identify guilds');
  const url = `https://discord.com/oauth2/authorize?client_id=${env.DISCORD_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}&state=${state}`;
  return { url };
}

export type OAuthResult =
  | { ok: true }
  | { ok: false; reason: string; status: 400 | 401 | 502 };

export async function handleOAuthCallback(
  c: Context,
  _client: Client,
  code: string,
  state: string,
): Promise<OAuthResult> {
  const savedState = getCookie(c, OAUTH_STATE_COOKIE);
  deleteCookie(c, OAUTH_STATE_COOKIE);
  if (!savedState || savedState !== state) {
    return { ok: false, reason: 'Invalid state', status: 400 };
  }

  const tokenResponse = await fetch('https://discord.com/api/v10/oauth2/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: env.DISCORD_CLIENT_ID,
      client_secret: env.DISCORD_CLIENT_SECRET ?? '',
      grant_type: 'authorization_code',
      code,
      redirect_uri: env.OAUTH_REDIRECT_URI ?? '',
    }),
  });

  if (!tokenResponse.ok) {
    return { ok: false, reason: 'Token exchange failed', status: 401 };
  }

  const tokenData = (await tokenResponse.json()) as { access_token: string };
  const accessToken = tokenData.access_token;

  const [userRes, guildsRes] = await Promise.all([
    fetch('https://discord.com/api/v10/users/@me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
    fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  ]);

  if (!userRes.ok || !guildsRes.ok) {
    return { ok: false, reason: 'Discord API error', status: 502 };
  }

  const user = (await userRes.json()) as { id: string; username: string };
  const guilds = (await guildsRes.json()) as Array<{ id: string }>;

  const session: Session = {
    userId: user.id,
    username: user.username,
    guilds: guilds.map((g) => g.id),
  };

  setCookie(c, SESSION_COOKIE, encodeSession(session), {
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'Lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });

  return { ok: true };
}

export async function requireSession(c: Context): Promise<Session | undefined> {
  const token = getCookie(c, SESSION_COOKIE);
  if (!token) return undefined;
  return decodeSession(token);
}
