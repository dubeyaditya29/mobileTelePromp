# Architecture

## Overview

Mobile TelePromp is a client-only Progressive Web App. There is no application server in v0.1.0. The browser provides camera access, recording, local persistence, and (optionally) offline shell caching via a service worker.

```
┌─────────────────────────────────────────────┐
│                   Browser                   │
│  ┌──────────┐  ┌──────────┐  ┌───────────┐  │
│  │  Editor  │→ │ Recorder │→ │  Review   │  │
│  └────┬─────┘  └────┬─────┘  └─────┬─────┘  │
│       │             │              │        │
│  localStorage   getUserMedia   Blob download│
│                 MediaRecorder  / Web Share  │
└─────────────────────────────────────────────┘
```

## Views

| View | Responsibility |
|------|----------------|
| `edit` | Author script + teleprompter settings |
| `record` | Camera preview, scrolling text, capture |
| `review` | Playback, download, share, retake |

State is held in `App` and passed down. Script content and settings are persisted with `saveScript` / `loadScript`.

## Key modules

### Hooks

- **`useCamera`** — `getUserMedia`, attach to `<video>`, flip facing mode, cleanup tracks
- **`useMediaRecorder`** — start/stop `MediaRecorder`, assemble `Blob`, mime fallback
- **`useTeleprompterScroll`** — `requestAnimationFrame` scroll driven by px/s speed

### Libraries

- **`lib/mime.ts`** — prefer MP4 on Safari / iOS when supported, else WebM
- **`lib/download.ts`** — object-URL download + Web Share files API
- **`lib/storage.ts`** — versioned `localStorage` key `mobile-telepromp:script:v1`

## Recording model

The recorded video is the **camera + microphone stream**, not a composited canvas of the UI. The teleprompter text is for the speaker only and is not burned into the file.

That keeps the MVP simple and avoids canvas encoding complexity on mobile.

## PWA

`vite-plugin-pwa` emits:

- Web App Manifest (`name`, icons, `standalone` display)
- Service worker that precaches the app shell

Camera still requires a secure context (HTTPS or localhost). Offline mode can open the shell and edit scripts; recording still needs media devices when available.

## Future extension points

- Script library (IndexedDB)
- Burn-in / canvas composite recording
- Speech-driven scroll
- Cloud sync / accounts
