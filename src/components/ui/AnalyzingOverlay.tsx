import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SparkleIcon } from './icons'

interface AnalyzingOverlayProps {
  visible: boolean
}

const MESSAGE_INTERVAL_MS = 1800

export function AnalyzingOverlay({ visible }: AnalyzingOverlayProps) {
  const { t } = useTranslation()
  const messages = t('scan.analyzingMessages', { returnObjects: true }) as string[]
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!visible) {
      setIndex(0)
      return
    }
    const timer = setInterval(() => setIndex(i => (i + 1) % messages.length), MESSAGE_INTERVAL_MS)
    return () => clearInterval(timer)
  }, [visible, messages.length])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-6 backdrop-blur-sm">
      <div className="flex w-full max-w-xs flex-col items-center gap-4 rounded-3xl bg-card px-8 py-9 text-center shadow-[0_20px_60px_rgba(20,35,29,0.25)]">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <span className="absolute inset-0 animate-ping rounded-full bg-brand-200/60" />
          <SparkleIcon className="relative h-8 w-8 animate-spin text-brand-600" style={{ animationDuration: '2.2s' }} />
        </span>
        <p key={index} className="animate-[fade-in_0.25s_ease] text-sm font-medium text-ink-700">
          {messages[index]}
        </p>
      </div>
    </div>
  )
}
