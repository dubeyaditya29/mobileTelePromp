import { useCallback, useEffect, useState } from 'react'
import { ScriptEditor } from './components/ScriptEditor'
import { RecorderView } from './components/RecorderView'
import { ReviewPanel } from './components/ReviewPanel'
import { OnboardingGate } from './components/OnboardingGate'
import { loadScript, saveScript } from './lib/storage'
import type { AppView, ScriptState, TeleprompterSettings } from './types'
import './App.css'

interface ReviewState {
  blob: Blob
  fileExtension: string
}

function App() {
  const [view, setView] = useState<AppView>('edit')
  const [script, setScript] = useState<ScriptState>(() => loadScript())
  const [review, setReview] = useState<ReviewState | null>(null)

  useEffect(() => {
    saveScript(script)
  }, [script])

  const updateSettings = useCallback((patch: Partial<TeleprompterSettings>) => {
    setScript((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }))
  }, [])

  const handleRecordingComplete = useCallback(
    (blob: Blob, fileExtension: string) => {
      setReview({ blob, fileExtension })
      setView('review')
    },
    [],
  )

  return (
    <div className={`app app-${view}`}>
      <OnboardingGate />

      {view === 'edit' && (
        <ScriptEditor
          title={script.title}
          body={script.body}
          settings={script.settings}
          onTitleChange={(title) => setScript((current) => ({ ...current, title }))}
          onBodyChange={(body) => setScript((current) => ({ ...current, body }))}
          onSettingsChange={updateSettings}
          onStartRecording={() => setView('record')}
        />
      )}

      {view === 'record' && (
        <RecorderView
          script={script}
          onSettingsChange={updateSettings}
          onExit={() => setView('edit')}
          onRecordingComplete={handleRecordingComplete}
        />
      )}

      {view === 'review' && review && (
        <ReviewPanel
          blob={review.blob}
          fileExtension={review.fileExtension}
          title={script.title}
          onRetake={() => {
            setReview(null)
            setView('record')
          }}
          onBackToEditor={() => {
            setReview(null)
            setView('edit')
          }}
        />
      )}
    </div>
  )
}

export default App
