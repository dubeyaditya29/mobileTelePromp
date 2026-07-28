import { DEFAULT_SCRIPT, type ScriptState } from '../types'

const STORAGE_KEY = 'mobile-telepromp:script:v1'

export function loadScript(): ScriptState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { ...DEFAULT_SCRIPT, settings: { ...DEFAULT_SCRIPT.settings } }

    const parsed = JSON.parse(raw) as Partial<ScriptState>
    return {
      title: parsed.title?.trim() || DEFAULT_SCRIPT.title,
      body: typeof parsed.body === 'string' ? parsed.body : DEFAULT_SCRIPT.body,
      settings: {
        ...DEFAULT_SCRIPT.settings,
        ...(parsed.settings ?? {}),
      },
      updatedAt: parsed.updatedAt || new Date().toISOString(),
    }
  } catch {
    return { ...DEFAULT_SCRIPT, settings: { ...DEFAULT_SCRIPT.settings } }
  }
}

export function saveScript(script: ScriptState): void {
  const payload: ScriptState = {
    ...script,
    updatedAt: new Date().toISOString(),
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}
