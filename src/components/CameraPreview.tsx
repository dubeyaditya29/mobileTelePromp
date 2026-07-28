import type { RefObject } from 'react'

interface CameraPreviewProps {
  videoRef: RefObject<HTMLVideoElement | null>
  facingMode: 'user' | 'environment'
}

export function CameraPreview({ videoRef, facingMode }: CameraPreviewProps) {
  return (
    <video
      ref={videoRef}
      className={`camera-preview ${facingMode === 'user' ? 'mirrored-video' : ''}`}
      playsInline
      muted
      autoPlay
      aria-label="Camera preview"
    />
  )
}
