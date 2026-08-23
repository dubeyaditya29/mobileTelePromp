# AGENTS.md

Guidance for AI coding agents working in this repository.

## What this project is

**ScrollTake** (`package.json` name: `scrolltake`) — a free, client-only PWA teleprompter for recording talking-head videos. Users paste a script, tune scroll speed/font size/mirror/countdown, then record video with their phone camera while the script scrolls on screen.

- **No backend / no server.** Everything runs in the browser: `getUserMedia` + `MediaRecorder` for capture, `localStorage` for persistence, Blob download / Web Share for export.
- **Recorded output is the raw camera+mic stream**, not a composited canvas of the teleprompter UI. Do not assume the scrolling text is burned into the video.
- Monetization: Google AdSense was removed in v0.2.x. Payment gateways are planned for the future — do not reintroduce ad code.

## Commands

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # tsc -b && vite build  → dist/
npm run preview    # Serve the production build
npm run typecheck  # tsc -b --pretty false
```

Verification rules:

- **`npm run typecheck` is also the linter.** There is no ESLint/Prettier config; `npm run lint` is an alias for typecheck.
- **There is no test framework installed.** Verify changes with `npm run typecheck && npm run build`. Do not invent test scripts or install test runners without being asked.
- Requires **Node.js >= 20.16.0** (pinned in `.nvmrc`). Package manager is npm (see `package-lock.json`).

## Tech stack

| Layer     | Choice                                        |
|-----------|-----------------------------------------------|
| Framework | React 19 (functional components + hooks only) |
| Bundler   | Vite 6                                        |
| Language  | TypeScript (strict)                           |
| PWA       | `vite-plugin-pwa` (manifest + service worker) |
| Styling   | Plain CSS (`src/index.css`, `src/App.css`)    |
| Routing   | None — see View state machine below           |

## Repository layout

```
index.html                  # App shell; Google Fonts (Outfit + Shrikhand) loaded here
vite.config.ts              # Vite + React plugin + PWA plugin (manifest defined HERE, not in public/)
public/                     # Static assets: icons, .nojekyll
src/
  main.tsx                  # StrictMode entry
  App.tsx                   # Root state owner: view switching + script state
  types.ts                  # AppView, ScriptState, TeleprompterSettings, DEFAULT_*
  components/               # One component per view/feature (ScriptEditor, RecorderView,
                            # ReviewPanel, CameraPreview, TeleprompterScroller,
                            # OnboardingGate, InfoPage)
  hooks/
    useCamera.ts            # getUserMedia lifecycle, facing-mode flip, track cleanup
    useMediaRecorder.ts     # start/stop capture, Blob assembly, mime fallback
    useTeleprompterScroll.ts# requestAnimationFrame scroll driven by px/s
    useInstallPrompt.ts     # PWA install prompt handling
  lib/
    brand.ts                # APP_NAME / APP_TAGLINE constants
    mime.ts                 # Prefers MP4 on Safari/iOS, else WebM
    download.ts             # Object-URL save + Web Share API fallbacks
    storage.ts              # Versioned localStorage key: `mobile-telepromp:script:v1`
    onboarding.ts           # First-run onboarding flag helpers
docs/
  architecture.md           # Read this before structural changes
  browser-support.md        # Platform quirks (iOS Safari etc.)
  roadmap.md                # Planned features
.github/workflows/deploy-pages.yml
```

## Architecture notes

### View state machine

There is no router. `App.tsx` holds `view: AppView` (`'edit' | 'record' | 'review' | 'about' | 'privacy'`) and conditionally renders panels. All state lives in `App` and flows down as props; children communicate upward exclusively through callback props (`onXxx`). Follow this pattern — do not introduce context, Redux, or a router without being asked.

### Data flow

1. `loadScript()` hydrates `ScriptState` from localStorage on mount.
2. Every change to title/body/settings calls `saveScript()` via a `useEffect`.
3. Recording completes → `{ blob, fileExtension }` stored in review state → ReviewPanel handles download/share.

## Conventions

- TypeScript strict mode; avoid `any` and non-null assertions except where already used (`document.getElementById('root')!`).
- Functional components with typed prop interfaces (`interface XxxProps`) — no class components.
- Keep CSS in the existing plain-CSS files using the established retro/paper theme variables (e.g. `--muted`); do not add Tailwind/CSS-in-JS.
- Comments are rare in this codebase; match that style.
- Bump `version` in `package.json` and add a CHANGELOG entry (Keep a Changelog format) when asked to release; update the `scrolltake-version` meta tag in `index.html` too.

## Gotchas

- **`base: '/'` in `vite.config.ts` is intentional** — the app deploys to the GitHub user-site root (`https://dubeyaditya29.github.io/`). Changing it breaks the live site.
- **Deployment is dual-target:** the Actions workflow publishes `dist/` to both this repo's `gh-pages` branch *and* `dubeyaditya29/dubeyaditya29.github.io` (gated by the `SITE_DEPLOY_TOKEN` secret). Never remove either deploy step without checking.
- **PWA manifest is configured in `vite.config.ts`** (icons, theme colors `#2a1a12` / background `#1f120c`), not as a static `manifest.json`. Update it there.
- **Camera requires a secure context** (HTTPS or localhost). You cannot fully exercise recording in a headless environment; verify such changes by reasoning + build, and say so.
- **iOS Safari quirks matter:** recording mime-type selection lives in `lib/mime.ts`; Web Share has feature detection in `lib/download.ts`. Preserve the fallback chains.
- localStorage schema is versioned via the key name (`...:v1` in `lib/storage.ts`); bump the version rather than mutating the shape silently.
