import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { isAxiosError } from 'axios'
import { useScanFood } from '@/queries/nivoCal.queries'
import { useFormatNumber } from '@/hooks/useFormatNumber'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { AnalyzingOverlay } from '@/components/ui/AnalyzingOverlay'
import { CameraIcon, ImageIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

const HEALTH_COLOR: Record<string, string> = {
  healthy: 'bg-brand-50 text-brand-700',
  moderate: 'bg-amber-500/10 text-amber-500',
  unhealthy: 'bg-rose-500/10 text-rose-500',
}

export function ScanPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const scanFood = useScanFood()
  const formatNumber = useFormatNumber()

  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<Awaited<ReturnType<typeof scanFood.mutateAsync>> | null>(null)
  const [insufficientCredits, setInsufficientCredits] = useState(false)

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl) }, [previewUrl])

  function handlePick(f: File | undefined) {
    if (!f) return
    setError(null)
    setFile(f)
    setPreviewUrl(URL.createObjectURL(f))
  }

  function reset() {
    setFile(null)
    setPreviewUrl(null)
    setNote('')
    setResult(null)
    setError(null)
  }

  async function handleAnalyze() {
    if (!file) return
    setError(null)
    try {
      const image = await fileToDataUrl(file)
      scanFood.mutate(
        { image, note: note || undefined },
        {
          onSuccess: data => setResult(data),
          onError: err => {
            // پیش‌چک اعتبار روی بک‌اند (nivo-cal.service.ts) با ۴۰۰ رد می‌شه اگه موجودی
            // کافی نباشه — این تنها خطای ۴۰۰ روی این endpoint‌ه، پس با status تشخیص می‌دیم.
            if (isAxiosError(err) && err.response?.status === 400) {
              setInsufficientCredits(true)
              return
            }
            setError(t('scan.error'))
          },
        },
      )
    } catch {
      setError(t('scan.error'))
    }
  }

  if (result) {
    return (
      <div className="space-y-5 px-5 pb-6 pt-8">
        <h1 className="text-lg font-bold text-ink-900">{t('scan.resultTitle')}</h1>

        {!result.isFood && (
          <Card className="bg-amber-500/10 text-sm text-amber-600">{t('scan.notFoodWarning')}</Card>
        )}

        <Card className="flex flex-col items-center gap-2 py-6">
          <span className="text-3xl font-extrabold text-ink-900">{formatNumber(result.totalCalories)}</span>
          <span className="text-xs text-ink-500">{t('scan.totalCalories')}</span>
          <span className={cn('mt-2 rounded-full px-3 py-1 text-xs font-semibold', HEALTH_COLOR[result.healthScore])}>
            {t(`scan.healthScore.${result.healthScore}`)}
          </span>
        </Card>

        <div className="space-y-2">
          {result.items.map((item, i) => (
            <Card key={i} className="p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-ink-900">{item.nameFa}</span>
                <span className="text-sm font-semibold text-ink-700">{formatNumber(item.calories)} {t('common.kcal')}</span>
              </div>
              <p className="mt-0.5 text-xs text-ink-500">{item.portionEstimate}</p>
            </Card>
          ))}
        </div>

        {result.healthNotes.length > 0 && (
          <Card className="space-y-1.5">
            {result.healthNotes.map((note, i) => (
              <p key={i} className="text-xs leading-5 text-ink-500">• {note}</p>
            ))}
          </Card>
        )}

        <Button
          onClick={() => {
            reset()
            navigate('/')
          }}
          size="lg"
        >
          {t('scan.saveAndClose')}
        </Button>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh flex-col justify-center gap-5 px-5 pb-24 pt-8">
      <div className="text-center">
        <h1 className="text-lg font-bold text-ink-900">{t('scan.title')}</h1>
        <p className="mt-1 text-sm text-ink-500">{t('scan.subtitle')}</p>
      </div>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" hidden onChange={e => handlePick(e.target.files?.[0])} />
      <input ref={galleryInputRef} type="file" accept="image/*" hidden onChange={e => handlePick(e.target.files?.[0])} />

      {previewUrl ? (
        <div className="space-y-4">
          <img src={previewUrl} alt="" className="mx-auto h-64 w-full rounded-3xl object-cover" />
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            maxLength={200}
            placeholder={t('scan.notePlaceholder')}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {error && <p className="text-center text-xs text-rose-500">{error}</p>}
          <Button size="lg" onClick={handleAnalyze} loading={scanFood.isPending}>
            {scanFood.isPending ? t('scan.analyzing') : t('scan.submit')}
          </Button>
          <Button variant="ghost" onClick={reset} disabled={scanFood.isPending}>{t('scan.retake')}</Button>
        </div>
      ) : (
        <div className="space-y-3">
          <button
            onClick={() => cameraInputRef.current?.click()}
            className="flex w-full flex-col items-center gap-3 rounded-3xl border-2 border-dashed border-brand-200 bg-brand-50/50 py-10"
          >
            <CameraIcon className="h-9 w-9 text-brand-600" />
            <span className="text-sm font-semibold text-brand-700">{t('scan.takePhoto')}</span>
          </button>
          <button
            onClick={() => galleryInputRef.current?.click()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-white py-3.5 text-sm font-medium text-ink-700 shadow-[0_1px_2px_rgba(20,35,29,0.06)]"
          >
            <ImageIcon className="h-5 w-5" />
            {t('scan.choosePhoto')}
          </button>
        </div>
      )}

      <Modal open={insufficientCredits} onClose={() => setInsufficientCredits(false)}>
        <div className="flex flex-col items-center gap-1 text-center">
          <h2 className="text-lg font-bold text-ink-900">{t('credits.insufficientTitle')}</h2>
          <p className="text-sm text-ink-500">{t('credits.insufficientMessage')}</p>
          <div className="mt-4 w-full space-y-2">
            <Button size="lg" onClick={() => navigate('/credits')}>
              {t('credits.insufficientBuyCta')}
            </Button>
            <Button variant="ghost" onClick={() => setInsufficientCredits(false)}>
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      </Modal>

      <AnalyzingOverlay visible={scanFood.isPending} />
    </div>
  )
}
