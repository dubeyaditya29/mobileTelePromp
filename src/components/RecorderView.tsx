import { useCallback, useEffect, useRef, useState } from 'react'
import type { TouchEvent, WheelEvent } from 'react'
import { CameraPreview } from './CameraPreview'
import { TeleprompterScroller } from './TeleprompterScroller'
import { useCamera } from '../hooks/useCamera'
import { useMediaRecorder } from '../hooks/useMediaRecorder'
import { useTeleprompterScroll } from '../hooks/useTeleprompterScroll'
import type { ScriptState, TeleprompterSettings } from '../types'

const MIN_SPEED = 10
const MAX_SPEED = 120
const SPEED_STEP = 5

function clampSpeed(value: number): number {
  return Math.min(MAX_SPEED, Math.max(MIN_SPEED, Math.round(value)))
}

interface RecorderViewProps {
  script: ScriptState
  onSettingsChange: (patch: Partial<TeleprompterSettings>) => void
  onExit: () => void
  onRecordingComplete: (blob: Blob, fileExtension: string) => void
}

export function RecorderView({
  script,
  onSettingsChange,
  onExit,
  onRecordingComplete,
}: RecorderViewProps) {
  const { settings, body } = script
  const camera = useCamera('user')
  const recorder = useMediaRecorder()
  const recording = recorder.status === 'recording'
  const scroller = useTeleprompterScroll({
    speed: settings.speed,
    enabled: recording,
  })

  const [countdown, setCountdown] = useState<number | null>(null)
  const [prepError, setPrepError] = useState<string | null>(null)
  const lastWheelNudgeRef = useRef(0)
  const touchStartYRef = useRef<number | null>(null)

  useEffect(() => {
    void camera.start()
    return () => {
      camera.stop()
    }
    // Mount-only camera lifecycle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (recorder.status === 'stopped' && recorder.blob) {
      onRecordingComplete(recorder.blob, recorder.fileExtension)
    }
  }, [recorder.status, recorder.blob, recorder.fileExtension, onRecordingComplete])

  useEffect(() => {
    if (countdown === null) return

    if (countdown === 0) {
      setCountdown(null)
      if (!camera.stream) {
        setPrepError('Camera is not ready yet.')
        return
      }
      recorder.start(camera.stream)
      return
    }

    const timer = window.setTimeout(
      () => setCountdown((value) => (value ?? 1) - 1),
      1000,
    )
    return () => window.clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [countdown, camera.stream])

  const nudgeSpeed = useCallback(
    (delta: number) => {
      onSettingsChange({ speed: clampSpeed(settings.speed + delta) })
    },
    [onSettingsChange, settings.speed],
  )

  function beginRecording() {
    setPrepError(null)
    if (!camera.stream) {
      setPrepError(camera.error || 'Camera is not ready yet.')
      return
    }

    if (settings.countdownSeconds > 0) {
      setCountdown(settings.countdownSeconds)
      return
    }

    recorder.start(camera.stream)
  }

  function stopRecording() {
    recorder.stop()
  }

  function handleSpeedWheel(event: WheelEvent) {
    event.preventDefault()
    event.stopPropagation()

    const now = performance.now()
    if (now - lastWheelNudgeRef.current < 70) return
    lastWheelNudgeRef.current = now

    // Scroll / swipe up → faster; down → slower
    const direction = event.deltaY < 0 ? 1 : -1
    nudgeSpeed(direction * SPEED_STEP)
  }

  function handleSpeedTouchStart(event: TouchEvent) {
    touchStartYRef.current = event.touches[0]?.clientY ?? null
  }

  function handleSpeedTouchEnd(event: TouchEvent) {
    const startY = touchStartYRef.current
    touchStartYRef.current = null
    if (startY == null) return

    const endY = event.changedTouches[0]?.clientY
    if (endY == null) return

    const dy = startY - endY
    if (Math.abs(dy) < 28) return
    nudgeSpeed(dy > 0 ? SPEED_STEP : -SPEED_STEP)
  }

  const busy = countdown !== null
  const error = prepError || camera.error || recorder.error

  return (
    <section className="recorder">
      <CameraPreview videoRef={camera.videoRef} facingMode={camera.facingMode} />

      <div className="recorder-overlay" onWheel={handleSpeedWheel}>
        <header className="recorder-top">
          <button
            type="button"
            className="btn ghost compact"
            onClick={onExit}
            disabled={recording || busy}
          >
            Back
          </button>
          <div className="recorder-meta">
            <span className={`pill ${recording ? 'live' : ''}`}>
              {recording ? 'Recording' : busy ? 'Get ready' : 'Standby'}
            </span>
            <span className="pill subtle">{Math.round(scroller.progress * 100)}%</span>
          </div>
          <button
            type="button"
            className="btn ghost compact"
            onClick={() => void camera.flipCamera()}
            disabled={recording || busy}
          >
            Flip
          </button>
        </header>

        <TeleprompterScroller
          text={body}
          fontSize={settings.fontSize}
          lineHeight={settings.lineHeight}
          mirror={settings.mirror}
          containerRef={scroller.containerRef}
        />

        {countdown !== null && (
          <div className="countdown" aria-live="assertive" key={countdown}>
            {countdown}
          </div>
        )}

        {error && <p className="recorder-error">{error}</p>}

        <footer className="recorder-controls">
          <div
            className="speed-control"
            aria-label="Scroll speed"
            onTouchStart={handleSpeedTouchStart}
            onTouchEnd={handleSpeedTouchEnd}
          >
            <button
              type="button"
              className="btn compact speed-btn"
              onClick={() => nudgeSpeed(-SPEED_STEP)}
              disabled={settings.speed <= MIN_SPEED}
              aria-label="Slower"
            >
              −
            </button>
            <div className="speed-readout">
              <strong>{settings.speed}</strong>
              <span>px/s · scroll / swipe</span>
            </div>
            <button
              type="button"
              className="btn compact speed-btn"
              onClick={() => nudgeSpeed(SPEED_STEP)}
              disabled={settings.speed >= MAX_SPEED}
              aria-label="Faster"
            >
              +
            </button>
            <input
              className="speed-slider"
              type="range"
              min={MIN_SPEED}
              max={MAX_SPEED}
              step={1}
              value={settings.speed}
              onChange={(event) =>
                onSettingsChange({ speed: clampSpeed(Number(event.target.value)) })
              }
              aria-label="Scroll speed slider"
            />
          </div>

          {!recording && !busy && (
            <button type="button" className="btn record" onClick={beginRecording}>
              Record
            </button>
          )}

          {recording && (
            <>
              <button type="button" className="btn" onClick={scroller.toggle}>
                {scroller.isScrolling ? 'Pause scroll' : 'Resume scroll'}
              </button>
              <button type="button" className="btn danger" onClick={stopRecording}>
                Stop
              </button>
            </>
          )}
        </footer>
      </div>
    </section>
  )
}
