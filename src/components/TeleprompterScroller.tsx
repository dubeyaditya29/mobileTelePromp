import type { RefObject } from 'react'

interface TeleprompterScrollerProps {
  text: string
  fontSize: number
  lineHeight: number
  mirror: boolean
  containerRef: RefObject<HTMLDivElement | null>
}

export function TeleprompterScroller({
  text,
  fontSize,
  lineHeight,
  mirror,
  containerRef,
}: TeleprompterScrollerProps) {
  return (
    <div
      ref={containerRef}
      className={`teleprompter ${mirror ? 'mirrored' : ''}`}
      aria-label="Scrolling script"
    >
      <div
        className="teleprompter-inner"
        style={{ fontSize: `${fontSize}px`, lineHeight }}
      >
        <div className="teleprompter-spacer" aria-hidden="true" />
        <p>{text}</p>
        <div className="teleprompter-spacer" aria-hidden="true" />
      </div>
    </div>
  )
}
