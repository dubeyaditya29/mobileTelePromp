export const APP_NAME = 'ScrollTake'
export const APP_TAGLINE = 'Write. Scroll. Record.'

/** Set in .env / GitHub Actions secrets after AdSense approval */
export const ADSENSE_CLIENT_ID = import.meta.env.VITE_ADSENSE_CLIENT_ID as
  | string
  | undefined
export const ADSENSE_SLOT_EDITOR = import.meta.env.VITE_ADSENSE_SLOT_EDITOR as
  | string
  | undefined
export const ADSENSE_SLOT_REVIEW = import.meta.env.VITE_ADSENSE_SLOT_REVIEW as
  | string
  | undefined

export const adsEnabled = Boolean(ADSENSE_CLIENT_ID)
