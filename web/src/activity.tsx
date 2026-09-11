import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';

function ActivityApp() {
  return (
    <main className="container">
      <h1>Discord Activity Shell</h1>
      <p>This is a placeholder for your Discord Embedded App.</p>
      <p>Mount the Embedded App SDK here and implement your game or experience.</p>
    </main>
  );
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ActivityApp />
  </StrictMode>,
);
