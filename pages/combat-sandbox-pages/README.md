# Combat Sandbox Pages Host

This directory contains a small Vite application that embeds the `@tba-worldswithin/combat-sandbox` package so it can be published to GitHub Pages.

## Available scripts

From this folder run:

```bash
npm install
npm run dev
npm run build
```

* `npm run dev` – starts a local dev server for iterating on the host shell.
* `npm run build` – outputs a static production build under `docs/demo` at the repository root. Point GitHub Pages at the `/docs` directory to publish the demo.

Because the sandbox is linked via a relative `file:` dependency, changes under `packages/combat-sandbox/` are picked up automatically during development.

## Deploying to Pages

1. Run `npm run build` from this folder.
2. Commit the generated contents of `docs/demo`.
3. In the repository settings enable GitHub Pages with the **docs/** folder as the source.
4. Visit `https://<your-user>.github.io/WWComSan/demo/` to interact with the hosted sandbox.
