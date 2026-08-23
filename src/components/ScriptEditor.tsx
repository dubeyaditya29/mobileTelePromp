import type { TeleprompterSettings } from '../types'
import { APP_NAME, APP_TAGLINE } from '../lib/brand'

interface ScriptEditorProps {
  title: string
  body: string
  settings: TeleprompterSettings
  onTitleChange: (title: string) => void
  onBodyChange: (body: string) => void
  onSettingsChange: (patch: Partial<TeleprompterSettings>) => void
  onStartRecording: () => void
  onOpenAbout: () => void
  onOpenPrivacy: () => void
}

const TICKER_TEXT = 'Write • Scroll • Record • Free in your browser • '.repeat(4)

export function ScriptEditor({
  title,
  body,
  settings,
  onTitleChange,
  onBodyChange,
  onSettingsChange,
  onStartRecording,
  onOpenAbout,
  onOpenPrivacy,
}: ScriptEditorProps) {
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0

  return (
    <section className="panel editor">
      <div className="ticker" aria-hidden="true">
        <p className="ticker-track">
          <span>{TICKER_TEXT}</span>
          <span>{TICKER_TEXT}</span>
        </p>
      </div>
      <header className="panel-header">
        <div>
          <p className="eyebrow">{APP_NAME}</p>
          <h1>{APP_TAGLINE}</h1>
          <p className="lede">
            A browser teleprompter for talking-head videos — open the link, grant
            camera access, and record. No app store install.
          </p>
        </div>
      </header>

      <label className="field">
        <span>Script title</span>
        <input
          type="text"
          value={title}
          onChange={(event) => onTitleChange(event.target.value)}
          placeholder="Untitled script"
          maxLength={80}
        />
      </label>

      <label className="field">
        <span>Script</span>
        <textarea
          value={body}
          onChange={(event) => onBodyChange(event.target.value)}
          rows={12}
          placeholder="Paste or write your script here…"
        />
        <span className="hint">{wordCount} words · saved on this device</span>
      </label>

      <div className="settings-grid">
        <label className="field">
          <span>Scroll speed · {settings.speed}px/s</span>
          <input
            type="range"
            min={10}
            max={120}
            step={1}
            value={settings.speed}
            onChange={(event) =>
              onSettingsChange({ speed: Number(event.target.value) })
            }
          />
        </label>

        <label className="field">
          <span>Font size · {settings.fontSize}px</span>
          <input
            type="range"
            min={22}
            max={64}
            step={1}
            value={settings.fontSize}
            onChange={(event) =>
              onSettingsChange({ fontSize: Number(event.target.value) })
            }
          />
        </label>

        <label className="field">
          <span>Line height · {settings.lineHeight.toFixed(2)}</span>
          <input
            type="range"
            min={1.2}
            max={2}
            step={0.05}
            value={settings.lineHeight}
            onChange={(event) =>
              onSettingsChange({ lineHeight: Number(event.target.value) })
            }
          />
        </label>

        <label className="field">
          <span>Countdown · {settings.countdownSeconds}s</span>
          <input
            type="range"
            min={0}
            max={5}
            step={1}
            value={settings.countdownSeconds}
            onChange={(event) =>
              onSettingsChange({ countdownSeconds: Number(event.target.value) })
            }
          />
        </label>
      </div>

      <label className="toggle">
        <input
          type="checkbox"
          checked={settings.mirror}
          onChange={(event) => onSettingsChange({ mirror: event.target.checked })}
        />
        <span>Mirror text (for glass teleprompters)</span>
      </label>

      <div className="actions">
        <button
          type="button"
          className="btn primary"
          onClick={onStartRecording}
          disabled={!body.trim()}
        >
          Open recorder
        </button>
      </div>

      <nav className="footer-links">
        <button type="button" className="linkish" onClick={onOpenAbout}>
          About
        </button>
        <button type="button" className="linkish" onClick={onOpenPrivacy}>
          Privacy
        </button>
      </nav>
    </section>
  )
}
