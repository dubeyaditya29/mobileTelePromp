export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export async function shareBlob(blob: Blob, filename: string): Promise<boolean> {
  const file = new File([blob], filename, { type: blob.type || 'video/webm' })

  if (!navigator.canShare?.({ files: [file] })) {
    return false
  }

  await navigator.share({
    files: [file],
    title: 'Teleprompter recording',
  })

  return true
}

type SaveResult = 'saved' | 'cancelled' | 'downloaded' | 'shared'

interface SaveFilePickerOptions {
  suggestedName?: string
  types?: Array<{
    description: string
    accept: Record<string, string[]>
  }>
}

interface SaveFilePickerWindow extends Window {
  showSaveFilePicker?: (options?: SaveFilePickerOptions) => Promise<FileSystemFileHandle>
}

/**
 * Ask where to save when the File System Access API is available;
 * otherwise fall back to the share sheet (mobile) or a normal download.
 */
export async function saveBlob(blob: Blob, filename: string): Promise<SaveResult> {
  const win = window as SaveFilePickerWindow
  const extension = filename.includes('.') ? `.${filename.split('.').pop()}` : '.webm'
  const mime = blob.type || 'video/webm'

  if (typeof win.showSaveFilePicker === 'function') {
    try {
      const handle = await win.showSaveFilePicker({
        suggestedName: filename,
        types: [
          {
            description: 'Video recording',
            accept: { [mime]: [extension] },
          },
        ],
      })
      const writable = await handle.createWritable()
      await writable.write(blob)
      await writable.close()
      return 'saved'
    } catch (err) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        return 'cancelled'
      }
      // Fall through to share / download
    }
  }

  try {
    const shared = await shareBlob(blob, filename)
    if (shared) return 'shared'
  } catch {
    // Fall through
  }

  downloadBlob(blob, filename)
  return 'downloaded'
}
