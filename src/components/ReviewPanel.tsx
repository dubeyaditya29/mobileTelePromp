import { useEffect, useMemo, useState } from 'react'
import { saveBlob, shareBlob } from '../lib/download'
import { ADSENSE_SLOT_REVIEW } from '../lib/brand'
import { AdSlot } from './AdSlot'

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
  const [saveNote, setSaveNote] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const filename = useMemo(
    () => `${slugify(title) || 'scrolltake'}-${Date.now()}.${fileExtension}`,
    [title, fileExtension, blob],
  )

  useEffect(() => {
    const objectUrl = URL.createObjectURL(blob)
    setUrl(objectUrl)
    return () => URL.revokeObjectURL(objectUrl)
  }, [blob])

  async function handleSave() {
    setSaving(true)
    setSaveNote(null)
    try {
      const result = await saveBlob(blob, filename)
      if (result === 'saved') {
        setSaveNote('Saved to the location you chose.')
      } else if (result === 'shared') {
        setSaveNote('Opened share sheet — pick Save to Files or a folder.')
      } else if (result === 'downloaded') {
        setSaveNote('Download started. Check your Downloads folder.')
      }
    } catch {
      setSaveNote('Could not save the video. Try Share instead.')
    } finally {
      setSaving(false)
    }
  }

  async function handleShare() {
    try {
      const shared = await shareBlob(blob, filename)
      if (!shared) {
        await handleSave()
      }
    } catch {
      await handleSave()
    }
  }

  return (
    <section className="panel review">
      <header className="panel-header">
        <p className="eyebrow">Review</p>
        <h1>Your take is ready</h1>
        <p className="lede">
          Preview the clip, then choose where to save it. Everything stays on
          your device unless you share it.
        </p>
      </header>

      {url && <video className="review-video" src={url} controls playsInline />}

      <AdSlot slot={ADSENSE_SLOT_REVIEW} className="ad-slot-review" />

      {saveNote && <p className="hint save-note">{saveNote}</p>}

      <div className="actions">
        <button
          type="button"
          className="btn primary"
          disabled={saving}
          onClick={() => void handleSave()}
        >
          {saving ? 'Saving…' : 'Download / choose location'}
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
