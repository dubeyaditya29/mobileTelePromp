import { useEffect, useMemo, useState } from 'react'
import { downloadBlob, shareBlob } from '../lib/download'

interface ReviewPanelProps {
  blob: Blob
  fileExtension: string
  title: string
  onRetake: () => void
  onBackToEditor: () => void
}

export function ReviewPanel({
  blob,
  fileExtension,
  title,
  onRetake,
  onBackToEditor,
}: ReviewPanelProps) {
  const [url, setUrl] = useState('')
  const filename = useMemo(
    () => `${slugify(title) || 'teleprompter'}-${Date.now()}.${fileExtension}`,
    [title, fileExtension, blob],
  )

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [blob])

  async function handleShare() {
    try {
      const shared = await shareBlob(blob, filename)
      if (!shared) downloadBlob(blob, filename)
    } catch {
      downloadBlob(blob, filename)
    }
  }

  return (
    <section className="panel review">
      <header className="panel-header">
        <p className="eyebrow">Review</p>
        <h1>Your take is ready</h1>
        <p className="lede">
          Preview the clip, download it, or share it. Everything stays on your
          device unless you choose to share.
        </p>
      </header>

      {url && <video className="review-video" src={url} controls playsInline />}

      <div className="actions">
        <button
          type="button"
          className="btn primary"
          onClick={() => downloadBlob(blob, filename)}
        >
          Download video
        </button>
        <button type="button" className="btn" onClick={() => void handleShare()}>
          Share
        </button>
        <button type="button" className="btn" onClick={onRetake}>
          Retake
        </button>
        <button type="button" className="btn ghost" onClick={onBackToEditor}>
          Edit script
        </button>
      </div>
    </section>
  )
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
