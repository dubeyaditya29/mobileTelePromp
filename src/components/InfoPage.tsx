import { APP_NAME } from '../lib/brand'

interface InfoPageProps {
  page: 'privacy' | 'about'
  onBack: () => void
}

export function InfoPage({ page, onBack }: InfoPageProps) {
  return (
    <section className="panel info-page">
      <button type="button" className="btn ghost compact" onClick={onBack}>
        ← Back
      </button>

      {page === 'about' ? (
        <>
          <header className="panel-header">
            <p className="eyebrow">About</p>
            <h1>{APP_NAME}</h1>
            <p className="lede">
              A free browser teleprompter. Paste a script, scroll while you
              record, then download your video — no app store install.
            </p>
          </header>
          <ul className="gate-list">
            <li>Works on your phone as a Progressive Web App</li>
            <li>Scripts stay on your device</li>
            <li>Camera and mic are only used when you record</li>
          </ul>
        </>
      ) : (
        <>
          <header className="panel-header">
            <p className="eyebrow">Legal</p>
            <h1>Privacy</h1>
            <p className="lede">
              {APP_NAME} is built to keep your content on your device.
            </p>
          </header>
          <div className="info-copy">
            <p>
              <strong>Scripts</strong> are saved in your browser’s local storage
              on this device. We do not operate a server that stores your
              scripts or videos.
            </p>
            <p>
              <strong>Camera and microphone</strong> are accessed only after you
              allow them, and only to record locally in the browser. Recordings
              stay on your device unless you download or share them yourself.
            </p>
            <p>
              <strong>Ads:</strong> if Google AdSense is enabled on this site,
              Google may use cookies or similar technologies to show ads. See{' '}
              <a
                href="https://policies.google.com/technologies/ads"
                target="_blank"
                rel="noreferrer"
              >
                Google’s advertising policies
              </a>
              .
            </p>
            <p>
              You can clear this site’s data in your browser settings to remove
              saved scripts and preferences.
            </p>
          </div>
        </>
      )}
    </section>
  )
}
