# Immersive Archive V2 — Frontend

Entry point: `src/App.js` → `src/pages/ReelStudio.jsx`. This application is an archive-only interactive exhibition, not a 60-second movie.

## Cinematic intro
- `src/reel/apertureTimeline.js` — pure timing, camera path and per-artwork reveal functions.
- `src/reel/apertureSequence.js` — iris geometry, blue light shader and forming particles.
- `src/reel/archiveEngine.js` — runs the intro and interactive archive in the **same scene and renderer**.
- `src/reel/explore.js` — smoothly forms the original gallery positions as the camera flies in.
- `src/components/ui/portal-intro.tsx` — preloading-only curtain, skip control and visit-aware UI.

First entry: 3.25 s once assets have loaded; subsequent entries: 1.35 s; reduced motion: static archive without the camera flight. The intro can always be skipped. Works and video originals remain unchanged.

The older `dither-flow.tsx` and `bloim-animation-background.tsx` files remain available for reference but are no longer loaded at runtime.

## Verification
```bash
yarn install
yarn test:ci
yarn build
```

GitHub Actions: `.github/workflows/archive-quality.yml` at the repository root. The production app is deployed from `main` to https://showreel-kutuzov-v2-kutuzov.vercel.app.
