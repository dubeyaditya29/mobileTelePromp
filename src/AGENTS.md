# AGENTS.md — `src/`

Applies to everything under `src/`. See the root [AGENTS.md](../AGENTS.md) for commands, stack, and deployment gotchas.

## Structure

- `App.tsx` is the **only** state owner: it holds `view` (`edit | record | review | about | privacy`) and `ScriptState`. Everything below receives props.
- `components/` — one file per view/feature panel. Components are pure-ish: no fetching, no global stores; they emit events via `onXxx` callback props.
- `hooks/` — browser-API wrappers only (`getUserMedia`, `MediaRecorder`, rAF scrolling, install prompt). Hooks own imperative lifecycles and cleanup; components stay declarative.
- `lib/` — framework-free helpers (mime selection, download/share, localStorage, brand constants, onboarding flags). No React imports allowed here.
- `types.ts` — shared types + `DEFAULT_SETTINGS` / `DEFAULT_SCRIPT`.

## Rules

- Add new state to `App.tsx` and thread props down; don't create parallel contexts or stores.
- New browser APIs belong in `src/hooks/`, new pure utilities in `src/lib/`.
- Persisted data must go through `lib/storage.ts` (versioned key) — never touch `localStorage` directly from components.
- Styling: plain CSS classes in `App.css` / `index.css`, retro paper theme (`--muted`, dashed borders, warm palette). Match existing class naming (lowercase-kebab).
- Preserve iOS fallbacks in `lib/mime.ts` and `lib/download.ts`; recording must keep its mp4/webm and save/share chains intact.
