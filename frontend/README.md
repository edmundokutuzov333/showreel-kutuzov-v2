# Immersive Archive — React UI

Root: `src/App.js` -> `src/pages/ReelStudio.jsx`. Main mode: **archive only**.

The 2-second portal consists of `src/components/ui/portal-intro.tsx`, `dither-flow.tsx` and an optional lazy `bloim-animation-background.tsx`. TypeScript, Tailwind, and shadcn path aliases are configured; add UI elements under `src/components/ui` to keep aliases consistent.

Archive runtime: `src/reel/archiveEngine.js`, `archiveAssets.js`, `explore.js`, `cloud.js`, `formations.js`.

```bash
yarn install
yarn start
yarn build
yarn test:ci
```

Deployment URL: https://showreel-kutuzov-v2.vercel.app
