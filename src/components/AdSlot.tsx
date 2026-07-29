import { useEffect, useRef } from 'react'
import {
  ADSENSE_CLIENT_ID,
  adsEnabled,
} from '../lib/brand'

interface AdSlotProps {
  slot?: string
  format?: string
  className?: string
}

declare global {
  interface Window {
    adsbygoogle?: unknown[]
  }
}

export function AdSlot({ slot, format = 'auto', className = '' }: AdSlotProps) {
  const pushed = useRef(false)

  useEffect(() => {
    if (!adsEnabled || !slot || pushed.current) return
    try {
      window.adsbygoogle = window.adsbygoogle || []
      window.adsbygoogle.push({})
      pushed.current = true
    } catch {
      // Ad blockers / missing script — ignore
    }
  }, [slot])

  if (!adsEnabled || !ADSENSE_CLIENT_ID || !slot) {
    return null
  }

  return (
    <div className={`ad-slot ${className}`.trim()} aria-hidden="true">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={ADSENSE_CLIENT_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
