# Kutuzov | Immersive Archive

Standalone, archive-only exhibition built from the V3 3D gallery.
The 60-second showreel player and the earlier version selectors are removed.

## Live
https://showreel-kutuzov-v2.vercel.app

## Experience
1. A 2,000 ms cinematic portal animation with ordered Bayer dithering, a blue-black tunnel, coordinated rings, perspective zoom, glow and iris transition
2. Automatically arrive at the original interactive galaxy of **155 portfolio works**
3. Drag/touch to orbit; pinch/wheel/zoom buttons to approach; click/tap art to inspect it; filters to isolate disciplines
4. Navigate with the arrow keys, `+`/`-` to zoom, `R` to reset and `F` to enter fullscreen

The project intentionally retains real video work within the portfolio archive's VIDEO category; it removes only the showreel player and film timeline.

## Architecture
- React 19 + Create React App/CRACO
- TypeScript for new animated UI components, existing application modules remain in JavaScript during migration
- Tailwind CSS 3 and the existing **shadcn-style** folder at `frontend/src/components/ui/` (aliases resolve `@/components/ui`)
- `src/components/ui/dither-flow.tsx` implements a GPU-efficient 2-second entrance shader, adapted from the supplied dither reference
- `src/components/ui/bloim-animation-background.tsx` embeds the supplied `unicornstudio-react` scene (project ID `9tVO0xGS8DIar1DF4Sqc`), lazy-loaded only on higher-performance desktops; the native shader remains a complete fallback
- `src/components/ui/portal-intro.tsx` runs the precise 2-second transition
- `src/reel/archiveAssets.js` fetches only `catalog.json` and two `atlas*.webp` files; artwork originals load only when selected
- `src/reel/archiveEngine.js` owns one-pass Three.js rendering and input motion. No timeline, audio engine, export renderer or video preloading on entry

## Installation and testing
```bash
cd frontend
yarn install
yarn start
yarn build
yarn test:ci
```

Tailwind is already configured in `tailwind.config.js` and `src/index.css`. shadcn-compatible settings are in `components.json`. New component files must live under `src/components/ui` rather than a repository-root `/components/ui`, because the alias `@/` points at `src/`.
You can add official shadcn components with `npx shadcn@latest add <component-name>`. If starting a *different* app from scratch, initialise it with `npx shadcn@latest init` and install Tailwind and TypeScript there; this repository already contains those configurations.

## Deployment isolation
- GitHub: `edmundokutuzov333/showreel-kutuzov-v2`
- Branch: `main`
- Vercel team: `KUTUZOV`
- Project: `showreel-kutuzov-v2`
- Root Directory: `frontend`
- The original `showreel-kutuzov` and `kutuzovportfolio333` projects are never deployment targets for this code.

## Performance design
The intro is time-bounded and unloads before the archive renderer is instantiated. Gallery assets are prefetched concurrently with the 2-second portal. The archive is GPU-instanced, rendered in one pass with device-aware resolution caps, throttled hover hit tests, and no extra full-resolution post pass. The portal uses bounded render resolution and disables the optional Unicorn Studio layer on phones and in reduced-motion mode.

The portal timing is 2 seconds. On a slow network the gallery can require extra time to load its resources; after 2 seconds the portal leaves rather than artificially delaying the interface.
