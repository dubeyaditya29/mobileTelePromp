import { useCallback, useRef, useState } from 'react'
import { extensionForMime, pickRecorderMimeType } from '../lib/mime'

export type RecorderStatus = 'idle' | 'recording' | 'stopped'

interface UseMediaRecorderResult {
  status: RecorderStatus
  blob: Blob | null
  error: string | null
  mimeType: string | undefined
  fileExtension: string
  start: (stream: MediaStream) => void
  stop: () => void
  reset: () => void
}

export function useMediaRecorder(): UseMediaRecorderResult {
  const recorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const [status, setStatus] = useState<RecorderStatus>('idle')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mimeType, setMimeType] = useState<string | undefined>()

  const reset = useCallback(() => {
    recorderRef.current = null
    chunksRef.current = []
    setBlob(null)
    setError(null)
    setStatus('idle')
  }, [])

  const stop = useCallback(() => {
    const recorder = recorderRef.current
    if (!recorder || recorder.state === 'inactive') return
    recorder.stop()
  }, [])

  const start = useCallback((stream: MediaStream) => {
    setError(null)
    setBlob(null)
    chunksRef.current = []

    if (typeof MediaRecorder === 'undefined') {
      setError('MediaRecorder is not supported in this browser.')
      return
    }

    const selectedMime = pickRecorderMimeType()
    setMimeType(selectedMime)

    try {
      const recorder = selectedMime
        ? new MediaRecorder(stream, { mimeType: selectedMime })
        : new MediaRecorder(stream)

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }

      recorder.onerror = () => {
        setError('Recording failed. Try again or use a different browser.')
        setStatus('idle')
      }

      recorder.onstop = () => {
        const type = recorder.mimeType || selectedMime || 'video/webm'
        const nextBlob = new Blob(chunksRef.current, { type })
        setBlob(nextBlob)
        setStatus('stopped')
      }

      recorderRef.current = recorder
      recorder.start(250)
      setStatus('recording')
    } catch {
      setError('Could not start recording on this device.')
      setStatus('idle')
    }
  }, [])

  return {
    status,
    blob,
    error,
    mimeType,
    fileExtension: extensionForMime(mimeType),
    start,
    stop,
    reset,
  }
}
