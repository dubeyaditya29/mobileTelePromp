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
