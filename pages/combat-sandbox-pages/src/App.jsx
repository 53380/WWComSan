import CombatSandbox from '@tba-worldswithin/combat-sandbox';
import '@tba-worldswithin/combat-sandbox/styles.css';
import './app.css';

export default function App() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1>Worlds Within Combat Sandbox</h1>
        <p>
          This host bundles the reusable combat sandbox package so it can be published as a GitHub Pages demo.
          The build emitted by Vite lives under <code>docs/demo</code> and can be served from the repository&apos;s Pages configuration.
        </p>
        <p className="app-links">
          <a href="../" rel="noreferrer">
            Documentation
          </a>
          <span aria-hidden="true">•</span>
          <a href="https://github.com/tba-worldswithin/WWComSan" target="_blank" rel="noreferrer">
            GitHub Repository
          </a>
        </p>
      </header>
      <main className="sandbox-wrapper">
        <CombatSandbox />
      </main>
      <footer className="app-footer">
        <p>MIT © 2024 Worlds Within Prototype</p>
      </footer>
    </div>
  );
}
