# Worlds Within Combat Sandbox

This GitHub Pages site renders the Markdown documentation for the combat sandbox package. The playable demo itself is delivered as a React component and is now bundled through the Vite host that lives under `docs/demo/`.

## What ships on Pages?

The repository exports the `@tba-worldswithin/combat-sandbox` package. Consumers embed the component inside their own React host (Vite, Next.js, Create React App, etc.) and bundle it alongside their application. Because the sandbox expects a full React runtime, the Pages deployment serves project documentation in Markdown instead of attempting to ship a prebuilt HTML copy of the demo.

## Try the sandbox locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run a development host (example using Vite):
   ```bash
   npm create vite@latest combat-sandbox-demo -- --template react
   cd combat-sandbox-demo
   npm install
   npm install ../packages/combat-sandbox lucide-react
   ```
3. Replace the generated `src/App.jsx` with:
   ```jsx
   import CombatSandbox from '@tba-worldswithin/combat-sandbox';
   import '@tba-worldswithin/combat-sandbox/styles.css';

   export default function App() {
     return (
       <div className="min-h-screen bg-gray-900 text-white">
         <CombatSandbox />
       </div>
     );
   }
   ```
4. Start the dev server with `npm run dev` and open the reported URL.

## Need a hosted build?

A preconfigured Vite host lives at [`pages/combat-sandbox-pages/`](../pages/combat-sandbox-pages/README.md). Running `npm run build` from that directory emits its production bundle to `docs/demo/` so GitHub Pages can serve the interactive sandbox alongside these docs. Point interested playtesters to `https://<your-user>.github.io/WWComSan/demo/` after publishing.
