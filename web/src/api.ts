export interface SiteConfig {
  inviteUrl: string;
  clientId: string;
  redirectUri: string;
}

export interface Me {
  id: string;
  username: string;
  guilds: Array<{ id: string; name: string }>;
}

const API_BASE = '/api';

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, { credentials: 'same-origin' });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return (await res.json()) as T;
}

export function getSiteConfig(): Promise<SiteConfig> {
  return fetchJson('/site-config');
}

export function getMe(): Promise<Me> {
  return fetchJson('/me');
}
