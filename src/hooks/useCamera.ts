import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { FacingMode } from '../types'

interface UseCameraResult {
  videoRef: RefObject<HTMLVideoElement | null>
  stream: MediaStream | null
  error: string | null
  isReady: boolean
  facingMode: FacingMode
  start: () => Promise<void>
  stop: () => void
  flipCamera: () => Promise<void>
}

export function useCamera(initialFacing: FacingMode = 'user'): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [facingMode, setFacingMode] = useState<FacingMode>(initialFacing)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)
    setIsReady(false)
  }, [])

  const attachStream = useCallback(async (next: MediaStream) => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = next
    setStream(next)

    const video = videoRef.current
    if (video) {
      video.srcObject = next
      await video.play()
      setIsReady(true)
    }
  }, [])

  const start = useCallback(async () => {
    setError(null)

    if (!navigator.mediaDevices?.getUserMedia) {
      setError('Camera access is not supported in this browser.')
      return
    }

    try {
      const next = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      await attachStream(next)
    } catch (err) {
      const message =
        err instanceof DOMException && err.name === 'NotAllowedError'
          ? 'Camera or microphone permission was denied.'
          : 'Could not start the camera. Check permissions and try again.'
      setError(message)
      setIsReady(false)
    }
  }, [attachStream, facingMode])

  const flipCamera = useCallback(async () => {
    const nextFacing: FacingMode = facingMode === 'user' ? 'environment' : 'user'
    setFacingMode(nextFacing)
    setError(null)

    try {
      const next = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: {
          facingMode: nextFacing,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })
      await attachStream(next)
    } catch {
      setError('Could not switch cameras on this device.')
    }
  }, [attachStream, facingMode])

  useEffect(() => () => stop(), [stop])

  return {
    videoRef,
    stream,
    error,
    isReady,
    facingMode,
    start,
    stop,
    flipCamera,
  }
}
