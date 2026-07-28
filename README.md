# Mobile TelePromp

**Version:** 0.1.0  
**Type:** Progressive Web App (PWA)

A mobile-first teleprompter you open in the browser. Paste a script, set scroll speed and text size, then record with your phone camera — no App Store install required.

## Features (v0.1.0)

- Script editor with local autosave
- Scroll speed, font size, line height, mirror, and countdown controls
- Front / rear camera preview
- Record camera + microphone via `MediaRecorder`
- Pause / resume scrolling while recording
- Review, download, and share the recorded clip
- Installable PWA (Add to Home Screen)

## Quick start

```bash
npm install
npm run dev
```

Open the printed local URL on your machine. For a real phone test, use HTTPS (or your LAN URL over trusted setup) because browsers require a secure context for camera access.

### Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | TypeScript project references check |
| `npm run lint` | Alias of typecheck for CI simplicity |

## Requirements

- **Node.js** `>= 20.16`
- Modern Chromium, Safari, or Firefox
- HTTPS in production (camera / mic APIs)

## Project layout

```
src/
  components/     UI: editor, recorder, scroller, review
  hooks/          Camera, MediaRecorder, teleprompter scroll
  lib/            Storage, mime selection, download/share
  types.ts        Shared types + defaults
docs/
  architecture.md
  roadmap.md
  browser-support.md
```

## Versioning

This project follows [Semantic Versioning](https://semver.org/):

- **MAJOR** — breaking UX or API changes
- **MINOR** — new features, backward compatible
- **PATCH** — bug fixes and small improvements

See [CHANGELOG.md](./CHANGELOG.md) for release notes.

## Privacy

Scripts are stored in `localStorage` on the device. Video is recorded in-memory and only leaves the device if you download or share it. There is no backend in v0.1.0.

## License

MIT — see [LICENSE](./LICENSE).
