import { useEffect, useState } from 'react';
import { getSiteConfig, getMe, type SiteConfig, type Me } from './api';

export default function App() {
  const [config, setConfig] = useState<SiteConfig | null>(null);
  const [me, setMe] = useState<Me | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getSiteConfig()
      .then(setConfig)
      .catch(() => setError('Failed to load site config'));
    getMe()
      .then(setMe)
      .catch(() => setMe(null));
  }, []);

  return (
    <main className="container">
      <h1>Discord Bot Template</h1>
      <p>Web admin UI shell. Connect your bot and customize this page.</p>
      {error && <p style={{ color: '#ff6b6b' }}>{error}</p>}
      <a className="button" href="/auth/login">
        Login with Discord
      </a>
      {config && (
        <div className="card">
          <h2>Site Config</h2>
          <pre>{JSON.stringify(config, null, 2)}</pre>
          <a className="button" href={config.inviteUrl} target="_blank" rel="noreferrer">
            Invite Bot
          </a>
        </div>
      )}
      {me && (
        <div className="card">
          <h2>Hello, {me.username}</h2>
          <p>Joined guilds with this bot:</p>
          <ul>
            {me.guilds.map((g) => (
              <li key={g.id}>{g.name}</li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
