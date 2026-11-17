# Kutuzov | Immersive Archive V2

A standalone, interactive exhibition of **155 artworks**. The showreel timeline and version selector are not part of this app. Video artworks remain available inside the archive.

## Live
https://showreel-kutuzov-v2-kutuzov.vercel.app

## The Aperture × Archive Awakens
The opening and exploration now share the **same Three.js scene, camera, canvas and rendering loop**. There is no cut between two independent WebGL engines.

1. A lightweight deep-blue loading curtain remains until the catalogue and both atlas textures have loaded. Network delays never expose an empty gallery.
2. The native 3D aperture appears as concentric luminous iris rings and a restrained shader halo. The pointer adds slight perspective movement.
3. A field of blue-white particles expands while **the actual atlas artworks** grow from their spatial seeds into the 3D gallery configuration.
4. The camera interpolates to the archive's exact home position; the last intro frame and the first interactive frame have identical positions and visibility.
5. Only after that rendered frame do the filters, drag/zoom controls and selected-work overlays become interactive.

Default opening duration: **3.25 seconds after assets are ready**. Returning visitors get **1.35 seconds**, using an optional localStorage flag. **The opening cannot be skipped.** Reduced-motion preference presents the static archive without flying camera movement.

The previous Dither Flow and Unicorn Studio components remain in the codebase as legacy references, but they are not mounted in the current intro; this avoids a competing GPU canvas.

## Interactive archive
- Orbit and pinch/wheel zoom, category filters and fullscreen view.
- Single draw-pass instanced atlas preview of all 155 artworks.
- Progressive high-resolution artwork textures for visible and close-up works, with bounded GPU cache and an expanded artwork viewer.
- Native image and video artwork selection. The full showreel film is intentionally absent.

## Code
- Frontend: React 19, Create React App/CRACO, Three.js, Tailwind CSS.
- Intro motion helpers: `frontend/src/reel/apertureTimeline.js` (pure interpolation and durations).
- 3D iris and particles: `frontend/src/reel/apertureSequence.js`.
- Shared camera and frame loop: `frontend/src/reel/archiveEngine.js` and `frontend/src/reel/explore.js`.
- Loading curtain and skip control: `frontend/src/components/ui/portal-intro.tsx`.
- Asset boot: `frontend/src/reel/archiveAssets.js`.
- Layout: `frontend/src/pages/ReelStudio.jsx`, `frontend/src/components/reel/Stage.jsx`.

## Verification
```bash
cd frontend
yarn install
yarn test:ci
yarn build
```

GitHub Actions runs `.github/workflows/archive-quality.yml` for the feature branch and `main`, including unit tests and a production build. Automated checks verify the exact final camera pose, zero portal intensity on handoff, completed artwork formation, shortened repeat visit and reduced-motion behaviour. Automated builds do **not** replace cross-device visual review.

## Deployment isolation
- Source: `edmundokutuzov333/showreel-kutuzov-v2`
- Production branch: `main`
- Vercel project: `showreel-kutuzov-v2`, team `KUTUZOV`
- Vercel project root: `frontend`
- The original `showreel-kutuzov` and `kutuzovportfolio333` remain independent.

## Latest archive interactions
The exhibition also supports short category-relative 3D connections and lighting, quiet idle orbit, distance-dependent image emphasis, one muted desktop video preview at a time, a compact next-work rail with catalogue atlas thumbnails, category/project-aware transitions, precise click/touch raycasting and an exact return-to-discovery camera snapshot. Mobile and data-saving contexts retain lightweight static video posters. No additional content pages or paid AI services are required.

See [technical compatibility and quality checks](docs/ARCHIVE_V2_NINE_IMPROVEMENTS.md).
