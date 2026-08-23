# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Removed

- Google AdSense integration: loader, Editor/Review ad slots, `ads.txt`, env vars (`VITE_ADSENSE_*`), and the setup guide. Monetization will move to payment gateways in a future release.

## [0.2.0] — 2026-07-29

### Changed

- Rebranded product name to **ScrollTake**
- Deploy base path is `/` so the app can live at the GitHub user-site root (required for AdSense `ads.txt`)

### Added

- `ads.txt` at site root for AdSense verification
- Optional AdSense loader + Editor/Review ad slots (env-gated)
- About and Privacy pages
- AdSense setup guide in `docs/adsense-setup.md`

## [0.1.0] — 2026-07-29

### Added

- Initial PWA scaffold (Vite + React + TypeScript)
- Script editor with title, body, and teleprompter settings
- Local autosave via `localStorage`
- Camera preview with flip (front / rear)
- Countdown before recording
- Scrolling teleprompter overlay with pause / resume
- `MediaRecorder` capture with mime-type fallback (`mp4` / `webm`)
- Review screen with download and Web Share support
- Web App Manifest + service worker via `vite-plugin-pwa`
- Project docs: architecture, roadmap, browser support
