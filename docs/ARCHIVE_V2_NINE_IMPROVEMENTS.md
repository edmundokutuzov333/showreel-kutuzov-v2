# Architecture decision: nine approved archive interactions

This document records the compatibility review for the existing archive-only V2, not a new film player. Scope: exactly 155 catalogue items, the original atlas assets and seven available video MP4s. UI copy is deliberately minimal.

## Compatibility matrix

| Approved feature | Existing dependency | Integration and compatibility | Main risk and mitigation |
| --- | --- | --- | --- |
| 03 Invisible Connections | Procedural galaxy positions in `Explore` and catalogue `cat`/`brand` | At most five short links are built from **real spatial neighbors of the same discipline**, prioritizing shared brands where the metadata supports them | Visual clutter / invented relationships: hidden until a work is hovered or selected; short distance limit; limited number; geometry positioned behind artwork surfaces |
| 04 Spatial Light | Atlas cards use unlit shader materials | Separate additive, soft blue halo, following the active artwork without changing the RGB values of the art textures | Image washout: no bloom postprocess, no changes to artwork shaders, light stays behind billboards |
| 06 Orbital Restraint | Existing `yaw/pitch/dist` interpolation and inactivity timer | Approximately 0.008 rad/s after seven seconds of inactivity, only without hover, drag, selection or reduced motion | Unwanted drift during examination: freeze the gallery when a work is open |
| 07 Depth Reveal | `galaxyPose`, existing fog and card `aDim` | Gentle, distance-aware image emphasis with a positive floor; no item is intentionally hidden by the effect | Lost work visibility: minimum 55% depth factor and original category filters preserved |
| 08 Living Frames | Seven original files at `public/reel/vid/148.mp4` ... `154.mp4` | One reusable off-DOM HTMLVideoElement / VideoTexture after intentional desktop hover, native aspect-ratio plane and opaque matte | GPU/CPU/network: one decoder at a time; delayed start; no media preload on boot; muted; gracefully keep atlas when playback is denied; touch/reduced-motion/save-data disabled |
| 13 Project Transitions | Work metadata and existing Selected panel | Distinct visual transitions for known same-brand projects, same discipline and unrelated categories; catalogue-driven navigation | Fabricated campaign sequences: only category/brand values already in catalogue are considered; no extra campaign images are invented |
| 15 Back to Discovery | Camera targets, orbit state, animated formation time | Capture the camera and timeline when opening the first work; freeze while browsing; restore exact state when closing | Returning to another position: snapshot is retained through rail navigation and cleared on close |
| 17 Precision Selection | `THREE.Raycaster`, `InstancedMesh`, pointer events | Recompute intersections at release, not from throttled hover; movement threshold in pixels; expanded touch tolerance | Mistaps and pinch conflicts: 6 px mouse / 12 px touch tap threshold, 10 px touch hit tolerance; pinch explicitly cancels drag |
| 20 Discovery Rail | Catalogue atlas cells / Selected panel | Four actual catalogue neighbors rendered using the existing atlas files (including VIDEO thumbnails) | Extra network requests/layout: no individual thumbnails; limited compact rail and no extra paragraphs |

## Dependency and ownership boundaries

- `archiveExperience.js`: pure calculation helpers; independently testable.
- `spatialAccents.js`: only two additional renderable objects (one halo plane and one line group), with bounded reusable geometry.
- `livingFrames.js`: one active video / decoder, one preview mesh and matte; allocated only on eligible hover, disposed on exit and unmount.
- `explore.js`: single authority over camera, pointer-to-instance picking, reveal and view snapshots. The intro still owns the exact arrival camera pose.
- `useReel.js`: React selection and the Three.js selection index are updated together.
- `ExploreOverlay.jsx`: one small 4-tile rail; no additional routes, pages or paragraphs.
- `portal-intro.tsx`, `ReelStudio.jsx`: skip-intro control and shortcut removed. First-time and return-time behavior otherwise retained.

## Conflicts explicitly addressed

1. **Lighting vs artwork fidelity**: no modifications to the original shader RGB pipeline; environment-only accents.
2. **Video playback vs texture memory**: no multi-video preload; tear down the active decoder and GPU texture before switching work.
3. **Orbit vs exact return**: automatic drift is disabled during selection, and the complete original camera state is snapshotted.
4. **Drag vs select**: an actual raycast on pointer-up with pixel thresholds, and pinch gestures cancel tap interactions.
5. **Transitions vs catalogue integrity**: animations are chosen from real category / brand facts only.
6. **Depth vs discoverability**: distance attenuation is bounded and does not replace filtering.
7. **Performance vs interactivity**: fixed-size link geometry, one halo, one decoder, GPU instanced cards, and no new heavyweight rendering engine.

## Validation

```bash
cd frontend
yarn install
yarn test:ci
yarn build
```

The GitHub workflow `.github/workflows/archive-quality.yml` also installs an isolated pinned Playwright/Chromium runner on Ubuntu 24.04 and runs `node scripts/archive-smoke.cjs` against the actual production-build files. The browser test exercises first and returning visits, disabled skip control, 155-item catalogue, filters, click-to-select, selected-work rail, previous/next navigation, close-to-discover and mobile boot/filtering. Software WebGL uses Chromium SwiftShader flags for consistent CI rendering.

Limits: CI smoke cannot prove visual artistry on every physical device, every video's native decoding behaviour or production network performance. A physical-device visual pass remains recommended, especially Safari/iOS and low-memory Android.

## Rollback and release isolation

All work is developed on `feat/archive-nine-interactions` and validated before fast-forwarding to the requested `main`. No force push, rebase or history rewriting. The production target is Vercel project `showreel-kutuzov-v2` (root `frontend`). The original portfolio and showreel repositories are not modified.
