export type AppView = 'edit' | 'record' | 'review' | 'about' | 'privacy'

export type FacingMode = 'user' | 'environment'

export interface TeleprompterSettings {
  speed: number
  fontSize: number
  lineHeight: number
  mirror: boolean
  countdownSeconds: number
}

export interface ScriptState {
  title: string
  body: string
  settings: TeleprompterSettings
  updatedAt: string
}

export const DEFAULT_SETTINGS: TeleprompterSettings = {
  speed: 40,
  fontSize: 36,
  lineHeight: 1.45,
  mirror: false,
  countdownSeconds: 3,
}

export const DEFAULT_SCRIPT: ScriptState = {
  title: 'Untitled script',
  body: `Welcome to ScrollTake.

Paste your script here, set the scroll speed and font size, then tap Record.

Look at the camera while reading the scrolling text. Pause anytime. When you finish, download your video — no app install required.`,
  settings: DEFAULT_SETTINGS,
  updatedAt: new Date().toISOString(),
}
