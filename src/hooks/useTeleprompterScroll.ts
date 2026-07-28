import { useCallback, useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'

interface UseTeleprompterScrollOptions {
  speed: number
  /** When true, scroll starts from the top and runs until paused or disabled. */
  enabled: boolean
}

interface UseTeleprompterScrollResult {
  containerRef: RefObject<HTMLDivElement | null>
  isScrolling: boolean
  progress: number
  play: () => void
  pause: () => void
  reset: () => void
  toggle: () => void
}

export function useTeleprompterScroll({
  speed,
  enabled,
}: UseTeleprompterScrollOptions): UseTeleprompterScrollResult {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const lastTsRef = useRef<number | null>(null)
  const speedRef = useRef(speed)
  const [isScrolling, setIsScrolling] = useState(false)
  const [progress, setProgress] = useState(0)

  speedRef.current = speed

  const cancelLoop = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    lastTsRef.current = null
  }, [])

  const updateProgress = useCallback(() => {
    const el = containerRef.current
    if (!el) {
      setProgress(0)
      return
    }
    const max = el.scrollHeight - el.clientHeight
    setProgress(max <= 0 ? 1 : Math.min(1, el.scrollTop / max))
  }, [])

  const tick = useCallback(
    (timestamp: number) => {
      const el = containerRef.current
      if (!el) return

      if (lastTsRef.current === null) lastTsRef.current = timestamp
      const delta = (timestamp - lastTsRef.current) / 1000
      lastTsRef.current = timestamp

      el.scrollTop += speedRef.current * delta
      updateProgress()

      const max = el.scrollHeight - el.clientHeight
      if (max > 0 && el.scrollTop >= max - 1) {
        el.scrollTop = max
        setIsScrolling(false)
        cancelLoop()
        return
      }

      rafRef.current = requestAnimationFrame(tick)
    },
    [cancelLoop, updateProgress],
  )

  const play = useCallback(() => {
    cancelLoop()
    setIsScrolling(true)
    rafRef.current = requestAnimationFrame(tick)
  }, [cancelLoop, tick])

  const pause = useCallback(() => {
    setIsScrolling(false)
    cancelLoop()
  }, [cancelLoop])

  const reset = useCallback(() => {
    const el = containerRef.current
    if (el) el.scrollTop = 0
    setProgress(0)
  }, [])

  const toggle = useCallback(() => {
    if (isScrolling) pause()
    else play()
  }, [isScrolling, pause, play])

  // Start scrolling as soon as recording becomes active; stop when it ends.
  useEffect(() => {
    if (!enabled) {
      pause()
      return
    }

    reset()
    play()
  }, [enabled, pause, play, reset])

  useEffect(() => () => cancelLoop(), [cancelLoop])

  return {
    containerRef,
    isScrolling,
    progress,
    play,
    pause,
    reset,
    toggle,
  }
}
