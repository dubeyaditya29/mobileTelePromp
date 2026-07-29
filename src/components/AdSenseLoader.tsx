import { useEffect } from 'react'
import { ADSENSE_CLIENT_ID, adsEnabled } from '../lib/brand'

/** Loads the AdSense script once when a publisher ID is configured. */
export function AdSenseLoader() {
  useEffect(() => {
    if (!adsEnabled || !ADSENSE_CLIENT_ID) return
    if (document.querySelector('script[data-scrolltake-adsense]')) return

    const script = document.createElement('script')
    script.async = true
    script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`
    script.crossOrigin = 'anonymous'
    script.dataset.scrolltakeAdsense = 'true'
    document.head.appendChild(script)
  }, [])

  return null
}
