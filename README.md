# ScrollTake

**Version:** 0.2.0  
**Type:** Progressive Web App (PWA)

A free browser teleprompter. Paste a script, set scroll speed and text size, then record with your phone camera — no App Store install.

## Live site (for AdSense)

**Root URL (correct for Google):** https://dubeyaditya29.github.io/

Google needs `ads.txt` at the domain root. That only works when the app is served at `/`, not at `/mobileTelePromp/`.

Setup steps: [docs/adsense-setup.md](./docs/adsense-setup.md)

## Features

- Script editor with local autosave
- Scroll speed, font size, line height, mirror, and countdown
- Camera record + scrolling teleprompter
- Download / share recordings
- Installable PWA
- About + Privacy pages
- Optional Google AdSense slots (off until you set env IDs)

## Quick start

```bash
npm install
npm run dev
```

## Scripts

| Command | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview the production build |
| `npm run typecheck` | TypeScript check |

## Privacy

Scripts stay in `localStorage` on your device. Video is recorded in the browser and only leaves the device if you download or share it.

## License

MIT — see [LICENSE](./LICENSE).
