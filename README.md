# KUTUZOV — V3 Immersive Archive

Standalone V3 showreel and interactive 3D portfolio archive. This repository is a separate copy from `showreel-kutuzov` and must never deploy to or alter its original Vercel project.

## Live experience

https://showreel-kutuzov-v2.vercel.app

## Product

- V3 only: 60-second original cinematic film with the original 3D galaxy, six campaigns, selected visual practice, brands, and animated EK sign-off
- Full-viewport experience without editorial page chrome
- **Explorar arquivos** activates the original 155-work 3D galaxy
- Filters, work previews, and links to the portfolio
- Drag to orbit, wheel/pinch to zoom, tap to inspect, arrow keys to orbit
- Play/pause, restart, sound toggle, immersive fullscreen, and lightweight movie scrubber

## Development

```sh
cd frontend
yarn install
yarn start
```

Build:

```sh
cd frontend
yarn build
```

The application is a Create React App frontend using React, Three.js, and Web Audio. The V3 movie and archive use original assets in `frontend/public/reel`.

## Deployment isolation

- Source: `edmundokutuzov333/showreel-kutuzov-v2`
- Production branch: `main`
- Vercel project: `showreel-kutuzov-v2` (team `KUTUZOV`)
- Root directory: `frontend`
- Do not link the project to `edmundokutuzov333/showreel-kutuzov`
- Do not attach the original show's production domain to this project

## Performance

- Videos are initialized without blocking the first gallery render
- Dynamic internal render resolution on mobile and lower-resolution displays
- Avoids unnecessary multisample render-target overhead
- Faster response damping for exploration; hover raycasting is throttled
- Removed non-essential external editor and session-recording scripts
- Retains artwork assets and original V3 creative direction

## Notes

WebGL and audio require a supported browser; sound starts following a user gesture. Canvas and audio performance depend on the device's hardware. The source files are retained in Git history, but the current app only exposes V3 and the 3D exploration mode.
