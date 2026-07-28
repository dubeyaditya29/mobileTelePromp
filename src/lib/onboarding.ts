const STORAGE_KEY = 'mobile-telepromp:onboarding:v1'

export interface OnboardingState {
  permissionsDone: boolean
  installDismissed: boolean
}

export function loadOnboardingState(): OnboardingState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { permissionsDone: false, installDismissed: false }
    const parsed = JSON.parse(raw) as Partial<OnboardingState>
    return {
      permissionsDone: Boolean(parsed.permissionsDone),
      installDismissed: Boolean(parsed.installDismissed),
    }
  } catch {
    return { permissionsDone: false, installDismissed: false }
  }
}

export function saveOnboardingState(state: OnboardingState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export async function getMediaPermissionState(): Promise<{
  camera: PermissionState | 'unknown'
  microphone: PermissionState | 'unknown'
}> {
  if (!navigator.permissions?.query) {
    return { camera: 'unknown', microphone: 'unknown' }
  }

  try {
    const [camera, microphone] = await Promise.all([
      navigator.permissions.query({ name: 'camera' as PermissionName }),
      navigator.permissions.query({ name: 'microphone' as PermissionName }),
    ])
    return { camera: camera.state, microphone: microphone.state }
  } catch {
    return { camera: 'unknown', microphone: 'unknown' }
  }
}

/** Request camera + mic once (then stop tracks) so the browser permission prompt appears. */
export async function requestCameraAndMic(): Promise<{ ok: boolean; error?: string }> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { ok: false, error: 'Camera and microphone are not supported in this browser.' }
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { facingMode: 'user' },
    })
    stream.getTracks().forEach((track) => track.stop())
    return { ok: true }
  } catch (err) {
    if (err instanceof DOMException && err.name === 'NotAllowedError') {
      return {
        ok: false,
        error: 'Permission denied. Enable camera and microphone in your browser settings, then try again.',
      }
    }
    return { ok: false, error: 'Could not access camera or microphone.' }
  }
}

export function isStandaloneDisplay(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari
    ('standalone' in navigator &&
      Boolean((navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

export function isIosDevice(): boolean {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}
