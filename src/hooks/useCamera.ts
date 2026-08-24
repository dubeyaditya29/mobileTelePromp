import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import type { FacingMode } from '../types'

interface UseCameraResult {
  videoRef: RefObject<HTMLVideoElement | null>
  stream: MediaStream | null
  error: string | null
  isReady: boolean
  facingMode: FacingMode
  resolution: CameraResolution | null
  start: () => Promise<void>
  stop: () => void
  flipCamera: () => Promise<void>
}

export interface CameraResolution {
  width: number
  height: number
  frameRate?: number
}

const VIDEO_CONSTRAINTS: MediaTrackConstraints = {
  width: { ideal: 3840 },
  height: { ideal: 2160 },
  frameRate: { ideal: 30 },
}

export function useCamera(initialFacing: FacingMode = 'user'): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const [facingMode, setFacingMode] = useState<FacingMode>(initialFacing)
  const [resolution, setResolution] = useState<CameraResolution | null>(null)

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    streamRef.current = null
    setStream(null)
    setResolution(null)
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

    // Some devices ignore resolution hints on the initial getUserMedia and
    // hand back 640x480; re-apply once the track is live, then read what
    // the hardware actually provides.
    const track = next.getVideoTracks()[0]
    if (!track) return
    try {
      await track.applyConstraints(VIDEO_CONSTRAINTS)
    } catch {
      // keep whatever the device can provide
    }
    const settings = track.getSettings()
    if (settings.width && settings.height) {
      setResolution({
        width: settings.width,
        height: settings.height,
        frameRate: settings.frameRate,
      })
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
          ...VIDEO_CONSTRAINTS,
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
          ...VIDEO_CONSTRAINTS,
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
    resolution,
    start,
    stop,
    flipCamera,
  }
}
