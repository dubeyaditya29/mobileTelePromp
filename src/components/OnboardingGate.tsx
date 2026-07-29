import { useEffect, useState } from 'react'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import {
  getMediaPermissionState,
  isIosDevice,
  isStandaloneDisplay,
  loadOnboardingState,
  requestCameraAndMic,
  saveOnboardingState,
  type OnboardingState,
} from '../lib/onboarding'
import { APP_NAME } from '../lib/brand'

type Step = 'loading' | 'permissions' | 'install' | null

export function OnboardingGate() {
  const install = useInstallPrompt()
  const [step, setStep] = useState<Step>('loading')
  const [state, setState] = useState<OnboardingState>(() => loadOnboardingState())
  const [permError, setPermError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function decide() {
      let current = loadOnboardingState()

      if (isStandaloneDisplay() || install.isInstalled) {
        current = { ...current, installDismissed: true }
        saveOnboardingState(current)
        if (!cancelled) setState(current)
      }

      const perms = await getMediaPermissionState()
      const alreadyAllowed =
        (perms.camera === 'granted' && perms.microphone === 'granted') ||
        current.permissionsDone

      if (cancelled) return

      if (!alreadyAllowed) {
        setStep('permissions')
        return
      }

      if (!current.installDismissed && !isStandaloneDisplay()) {
        setStep('install')
        return
      }

      setStep(null)
    }

    void decide()
    return () => {
      cancelled = true
    }
  }, [install.isInstalled])

  function persist(patch: Partial<OnboardingState>) {
    const next = { ...state, ...patch }
    setState(next)
    saveOnboardingState(next)
    return next
  }

  async function handleAllowMedia() {
    setBusy(true)
    setPermError(null)
    const result = await requestCameraAndMic()
    setBusy(false)

    if (!result.ok) {
      setPermError(result.error || 'Permission denied.')
      return
    }

    const next = persist({ permissionsDone: true })
    if (!next.installDismissed && !isStandaloneDisplay()) {
      setStep('install')
    } else {
      setStep(null)
    }
  }

  function skipPermissions() {
    const next = persist({ permissionsDone: true })
    if (!next.installDismissed && !isStandaloneDisplay()) {
      setStep('install')
    } else {
      setStep(null)
    }
  }

  async function handleInstall() {
    const outcome = await install.promptInstall()
    if (outcome === 'accepted' || outcome === 'dismissed') {
      persist({ installDismissed: true })
      setStep(null)
    }
  }

  function dismissInstall() {
    persist({ installDismissed: true })
    setStep(null)
  }

  if (!step) return null

  return (
    <div className="gate" role="dialog" aria-modal="true" aria-labelledby="gate-title">
      <div className="gate-card">
        {step === 'loading' && (
          <>
            <p className="eyebrow">{APP_NAME}</p>
            <h2 id="gate-title">Getting ready…</h2>
            <p className="lede">Checking camera access and install options.</p>
          </>
        )}

        {step === 'permissions' && (
          <>
            <p className="eyebrow">Before you start</p>
            <h2 id="gate-title">Allow camera & microphone</h2>
            <p className="lede">
              {APP_NAME} needs camera and microphone access to record your video.
              Nothing is uploaded — clips stay on your device unless you download
              or share them.
            </p>
            <ul className="gate-list">
              <li>Camera for your talking-head video</li>
              <li>Microphone for clear audio</li>
            </ul>
            {permError && <p className="gate-error">{permError}</p>}
            <div className="actions">
              <button
                type="button"
                className="btn primary"
                disabled={busy}
                onClick={() => void handleAllowMedia()}
              >
                {busy ? 'Waiting for approval…' : 'Allow camera & mic'}
              </button>
              <button type="button" className="btn ghost" onClick={skipPermissions}>
                Not now
              </button>
            </div>
          </>
        )}

        {step === 'install' && (
          <>
            <p className="eyebrow">Add shortcut</p>
            <h2 id="gate-title">Add {APP_NAME} to your home screen</h2>
            <p className="lede">
              Install it like an app for one-tap access — no App Store needed.
            </p>

            {install.canInstall ? (
              <div className="actions">
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => void handleInstall()}
                >
                  Add shortcut
                </button>
                <button type="button" className="btn ghost" onClick={dismissInstall}>
                  Continue in browser
                </button>
              </div>
            ) : isIosDevice() ? (
              <>
                <ol className="gate-list numbered">
                  <li>Tap the Share button in Safari</li>
                  <li>Choose “Add to Home Screen”</li>
                  <li>Tap Add</li>
                </ol>
                <div className="actions">
                  <button type="button" className="btn primary" onClick={dismissInstall}>
                    Got it
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="hint">
                  Use your browser menu → “Install app” or “Add to Home screen”
                  when it appears.
                </p>
                <div className="actions">
                  <button type="button" className="btn primary" onClick={dismissInstall}>
                    Continue
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}
