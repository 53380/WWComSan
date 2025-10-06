# @tba-worldswithin/combat-sandbox

A drop-in React component that re-creates the **Worlds Within** combat sandbox. It exposes the fully interactive toy combat arena plus
utilities and data definitions so that systems can experiment with the ability catalogue, elemental resonances, and combat pacing.

Verdant-themed abilities now weave healing directly into existing Attack and Special lanes, letting you test sustain-oriented builds without introducing a separate Support track.

## Installation

```bash
npm install @tba-worldswithin/combat-sandbox lucide-react
```

The component expects `react` and `react-dom` as peer dependencies (React 17 or newer).

## Usage

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import CombatSandbox from '@tba-worldswithin/combat-sandbox';

import '@tba-worldswithin/combat-sandbox/styles.css'; // Provide your own Tailwind/TW-compat styles

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<CombatSandbox />);
```

The sandbox uses Tailwind-style utility classes. When embedding into an existing project make sure those classes resolve to actual styles (for example by running Tailwind with the configuration that matches the demo site or by translating the classes into your own CSS).

## API

### `CombatSandbox`

```ts
function CombatSandbox(props?: {
  initialCharacterState?: CharacterState;
  initialEnemyState?: EnemyState;
  abilityLoadout?: AbilityLoadout;
}): JSX.Element;
```

* **initialCharacterState** – override the default player state.
* **initialEnemyState** – provide a custom enemy baseline.
* **abilityLoadout** – provide ids for the default abilities shown in the four combat lanes.

### Data & helpers

The package re-exports the data tables and helper utilities used by the sandbox:

```js
import {
  ABILITIES,
  ATTRIBUTES,
  ELEMENTS,
  WEAPONS,
  calculateERCost,
  calculateDamage,
  calculateResonance,
  characterReducer,
  enemyReducer
} from '@tba-worldswithin/combat-sandbox';
```

These exports make it possible to build additional tooling (spreadsheets, analysis dashboards, etc.) without coupling to the UI.

## Styling

The demo intentionally relies on Tailwind-style utility classes to keep the package framework-agnostic. Consumers can either:

1. Pull in the Tailwind setup from the Worlds Within demo, or
2. Map the used classes to their design system using CSS modules, vanilla CSS, or another utility-first framework.

## License

MIT © 2024 Worlds Within Prototype
