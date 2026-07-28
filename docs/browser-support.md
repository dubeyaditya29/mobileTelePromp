# Browser & device support

Mobile TelePromp targets modern mobile browsers. Camera and recording APIs vary.

## Secure context

`getUserMedia` and installable PWA features require a **secure context**:

- `https://…` in production
- `http://localhost` during development

Plain `http://` on a LAN IP often blocks camera access.

## Expected support

| Platform | Camera preview | Recording | Notes |
|----------|----------------|-----------|-------|
| Android Chrome | Yes | Yes (often WebM) | Best overall PWA support |
| Desktop Chrome / Edge | Yes | Yes | Good for development |
| iOS Safari (recent) | Yes | Yes (often MP4) | Add to Home Screen supported; mime types differ |
| Firefox (Android / desktop) | Yes | Usually WebM | Share API may be limited |
| Older iOS / WebViews | Partial | Partial | Prefer latest iOS |

## Mime type strategy

`src/lib/mime.ts` probes `MediaRecorder.isTypeSupported` in this order:

1. `video/mp4` (H.264 / AAC variants)
2. `video/webm` (VP9 / VP8 + Opus)

The review screen downloads with the matching extension (`.mp4` or `.webm`).

## Permissions UX

Permissions are requested when the user opens the recorder — not on first page load. If denied, the UI shows a recoverable error and does not crash.

## Known limitations (v0.1.0)

- Script text is **not** burned into the recorded video
- Long recordings may be interrupted by iOS memory / backgrounding
- Orientation changes mid-record can be jarring; landscape is recommended for longer takes
- Web Share with files requires a supporting browser and user gesture

## Testing checklist

1. Paste a short script on phone Safari / Chrome
2. Open recorder → allow camera + mic
3. Record 10–15 seconds with scroll running
4. Stop → preview → download
5. (Optional) Add to Home Screen and relaunch offline shell
