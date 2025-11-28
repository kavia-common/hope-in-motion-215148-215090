# Evobike Short Film Frontend

Modern React single-page experience to present a 90s short film with scene timeline, captions, and a final CTA.

## Quick Start

- `npm install`
- `npm start` then open http://localhost:3000

## Video Asset

- A placeholder is referenced at `/assets/evobike_placeholder.mp4`.
- Place your final cut in `public/assets/evobike_placeholder.mp4` to replace the placeholder.
- You may also host the video elsewhere and configure a base URL via:
  - `REACT_APP_FRONTEND_URL=https://your-domain.com` (will resolve to `${REACT_APP_FRONTEND_URL}/assets/evobike_placeholder.mp4`)

> TODO: Replace the placeholder with the final video and adjust scene timestamps if the final edit differs.

## Scene Map

Timestamps and captions are defined in `src/App.js`:

```
const SCENES = [
  { id: 1, start: 0, end: 7, title: 'Hogar feliz', narration: 'Éramos una familia sencilla… pero feliz.' },
  ...
  { id: 10, start: 79, end: 90, title: 'Graduación universitaria', narration: 'Evobike. El camino que te lleva a donde de verdad quieres estar.' },
];
```

- Adjust `start`/`end` if the final cut differs.
- The timeline shows markers for each scene; clicking a marker seeks the video.

## Theme

The "Ocean Professional" theme is implemented with CSS variables in `src/App.css`:
- primary `#2563EB`
- secondary/success `#F59E0B`
- error `#EF4444`
- background `#f9fafb`
- surface `#ffffff`
- text `#111827`
- subtle gradient background

## Accessibility

- Keyboard navigation supported on scene markers (Enter/Space).
- Captions use high-contrast chip overlay and aria-live="polite".
- Buttons have focus outlines.

## Environment Variables

These are optional and safe defaults are provided if not set:
- `REACT_APP_FRONTEND_URL`
- `REACT_APP_API_BASE`
- `REACT_APP_BACKEND_URL`
- `REACT_APP_WS_URL`

## Where to Update

- Replace video: `public/assets/evobike_placeholder.mp4`
- Scene timestamps & narrations: `src/App.js` (SCENES array)
- CTA destination: env variables above or update `FinalCTA` component

## Build

- `npm run build` to create a production build
