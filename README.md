<div align="center">

```
  ███████╗ ██████╗██████╗  ██████╗ ██╗     ██╗        ████████╗ █████╗ ██╗  ██╗███████╗
  ██╔════╝██╔════╝██╔══██╗██╔═══██╗██║     ██║           ╚██╔═╝ ██╔══██╗██║ ██╔╝██╔════╝
  ███████╗██║     ██████╔╝██║   ██║██║     ██║             ██║   ███████║█████╔╝ █████╗
  ╚════██║██║     ██╔══██╗██║   ██║██║     ██║             ██║   ██╔══██║██╔═██╗ ██╔══╝
  ███████║╚██████╗██║  ██║╚██████╔╝███████╗███████╗        ██║   ██║  ██║██║  ██╗███████╗
  ╚══════╝ ╚═════╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚══════╝        ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝
```

```
┌─────────────────────────────────────────────────────────────┐
│  ► A FREE BROWSER TELEPROMPTER ... NO APP STORE REQUIRED    │
│  ► INSERT SCRIPT ▸ SET SPEED ▸ PRESS RECORD                 │
│  ► PLAYER 1 READY                                           │
└─────────────────────────────────────────────────────────────┘
```

**v0.2.0** · **PWA** · **MIT License**

[Live Site](https://dubeyaditya29.github.io/) · [Report Bug](https://github.com/dubeyaditya29/mobileTelePromp/issues)

</div>

---

> Paste a script, set scroll speed and text size, then record with your phone camera — the teleprompter scrolls while you film. Everything runs in the browser. No installs, no sign-ups, no uploads.

## ▸ FEATURES

```
[✓] Script editor with local autosave
[✓] Scroll speed, font size, line height controls
[✓] Mirror mode + countdown timer
[✓] Camera record + scrolling teleprompter overlay
[✓] Download / share recordings
[✓] Installable PWA (works offline)
[✓] About + Privacy pages
```

## ▸ QUICK START — HOW TO PLAY

**CONTROLS:** a terminal, `npm`, and Node.js `>= 20.16.0` (see `.nvmrc`).

### STEP 1 · INSERT COIN (clone)

```bash
git clone https://github.com/dubeyaditya29/mobileTelePromp.git
cd mobileTelePromp
```

### STEP 2 · LOAD CARTRIDGE (install deps)

```bash
npm install
```

### STEP 3 · PRESS START (dev server)

```bash
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`). On your phone, open the same URL over your local network to test the camera flow.

### STEP 4 · FINAL BOSS (production build)

```bash
npm run build      # typecheck + production bundle
npm run preview    # serve the built app locally
```

### STEP 5 · HIGH SCORE (deploy)

Push to `main` and GitHub Actions builds + deploys the site automatically. No env vars are required.

## ▸ COMMAND REFERENCE

| COMMAND             | ACTION                          |
|---------------------|---------------------------------|
| `npm run dev`       | Start Vite dev server           |
| `npm run build`     | Typecheck + production build    |
| `npm run preview`   | Preview the production build    |
| `npm run typecheck` | TypeScript check only           |

## ▸ TECH STACK

| LAYER      | TOOL                        |
|------------|-----------------------------|
| Framework  | React 19                    |
| Bundler    | Vite 6                      |
| Language   | TypeScript                  |
| PWA        | vite-plugin-pwa             |
| Runtime    | Node.js >= 20.16.0          |

## ▸ DEPLOYMENT NOTES

- The app deploys to GitHub Pages at the **user-site root** (`https://dubeyaditya29.github.io/`) via GitHub Actions on push to `main`.
- It is also mirrored to the project pages URL (`/mobileTelePromp/`).

## ▸ PROJECT DOCS

- [Architecture](./docs/architecture.md)
- [Browser Support](./docs/browser-support.md)
- [Roadmap](./docs/roadmap.md)
- [Changelog](./CHANGELOG.md)

## ▸ PRIVACY

Scripts stay in `localStorage` **on your device**. Video is recorded entirely in the browser and only leaves the device if *you* download or share it.

## ▸ LICENSE

```
MIT License ─ see LICENSE
```

---

<div align="center">

```
        ═════════ GAME OVER? NO — JUST HIT SAVE. ═════════
                     © 2026 SCROLLTAKE
```

</div>
