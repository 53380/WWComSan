# WWComSan

A prototype sandbox for exploring the **Worlds Within** combat system. The repository contains the reusable React component that powers the toy combat arena together with the data tables and reducers that drive character stats, elemental resonances, weapons, and ability execution.

## Prerequisites

* [Node.js](https://nodejs.org/) 18 or newer
* npm 9+ (installed with Node)

## Launch the demo locally

The sandbox is shipped as a React component, so the quickest way to try it out is to spin up a small React host (Vite is used in the example below).

```bash
# Clone the repository
git clone https://github.com/<your-org>/WWComSan.git
cd WWComSan

# Scaffold a throwaway React host next to the package
npm create vite@latest combat-sandbox-demo -- --template react
cd combat-sandbox-demo

# Install the host's dependencies
npm install

# Install the combat sandbox and its icon dependency
npm install ../packages/combat-sandbox lucide-react
```

Replace the generated `src/App.jsx` with the snippet below so that the host renders the sandbox:

```jsx
import CombatSandbox from '@tba-worldswithin/combat-sandbox';
import '@tba-worldswithin/combat-sandbox/styles.css';

function App() {
  return (
    <div className="min-h-screen bg-gray-900">
      <CombatSandbox />
    </div>
  );
}

export default App;
```

Finally, start the dev server:

```bash
npm run dev
```

Vite prints a local URL (typically <http://localhost:5173>) – open it in a browser to launch the fully interactive combat demo.

> **Tip:** If you want to iterate on the component itself, keep the host running and edit the files under `packages/combat-sandbox/`. Vite will hot reload the changes.

## Publish the sandbox to GitHub Pages

The repository now includes a ready-to-ship Vite host under `pages/combat-sandbox-pages/`. It links to the local package via a `file:` dependency, applies the correct base path for project Pages deployments, and emits its production build to `docs/demo/` so that GitHub Pages can pick it up.

```bash
cd pages/combat-sandbox-pages
npm install
npm run build
```

Commit the generated `docs/demo/` contents and configure the repository to publish from the **docs/** folder. The hosted sandbox will be served from `https://<your-user>.github.io/WWComSan/demo/` alongside the existing Markdown documentation.

```bash
git add -A docs/demo
git commit -m "Rebuild Pages demo"
```

## Playing the sandbox

* **Build Lab (left column):** adjust quick resonance presets, pick one of the 23 weapon types, and tweak every attribute/element slider to explore how resonance values shift. The live resonance panel surfaces thresholds for Bonded and Merged abilities so you know when higher tier skills unlock.
* **Combat Arena (center):** cast abilities from the four lanes (Attack, Defense, Control, Special). Each button shows its ER cost, resonance requirements, and whether it is currently recommended for your build. Cancel a cast mid wind-up for a partial refund, watch for the flashing **Perfect Parry** prompt, toggle the enemy AI to have it fight back, or reset the encounter to start fresh.
* **Combat Log (right column):** every cast, damage event, ER gain, and error message is logged so you can audit the flow of a duel.

Tweaking the `abilityLoadout`, `initialCharacterState`, or `initialEnemyState` props when embedding the component lets you start the arena with custom builds or predefined enemy behaviours.

## Licensing

MIT © 2024 Worlds Within Prototype
