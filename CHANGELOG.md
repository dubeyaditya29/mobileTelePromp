# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- GitHub Pages blank screen: set Vite `base` to `/mobileTelePromp/` and deploy the production build via Actions

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
