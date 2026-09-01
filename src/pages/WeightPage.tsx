import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useDailySummary, useLogWeight } from '@/queries/nivoCal.queries'
import { useFormatNumber } from '@/hooks/useFormatNumber'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { FullScreenSpinner } from '@/components/ui/FullScreenSpinner'
import { cn } from '@/lib/cn'

export function WeightPage() {
  const { t, i18n } = useTranslation()
  const { data, isPending } = useDailySummary()
  const logWeight = useLogWeight()
  const [value, setValue] = useState('')
  const formatNumber = useFormatNumber()

  if (isPending || !data) return <FullScreenSpinner />

  const points = [...data.weightTrend.points].reverse()
  const current = points[0]?.weightKg

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const kg = Number(value)
    if (kg < 30 || kg > 300) return
    logWeight.mutate(kg, { onSuccess: () => setValue('') })
  }

  return (
    <div className="space-y-5 px-5 pb-4 pt-8">
      <h1 className="text-lg font-bold text-ink-900">{t('weight.title')}</h1>

      <Card className="flex flex-col items-center gap-1 py-8">
        <span className="text-4xl font-extrabold text-ink-900">{current !== undefined ? formatNumber(current) : '—'}</span>
        <span className="text-xs text-ink-500">{t('common.kg')}</span>
        {data.weightTrend.deltaKg !== 0 && (
          <span className={cn('mt-2 rounded-full px-3 py-1 text-xs font-semibold', data.weightTrend.deltaKg < 0 ? 'bg-brand-50 text-brand-700' : 'bg-amber-500/10 text-amber-600')}>
            {data.weightTrend.deltaKg > 0 ? '+' : ''}
            {formatNumber(data.weightTrend.deltaKg)} {t('common.kg')} · {t('weight.since', { days: formatNumber(data.weightTrend.periodDays) })}
          </span>
        )}
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-ink-900">{t('weight.logToday')}</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="number"
            step="0.1"
            value={value}
            onChange={e => setValue(e.target.value)}
            placeholder={t('weight.placeholder')}
            className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-2.5 text-center outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          <Button type="submit" className="w-auto px-5" loading={logWeight.isPending} disabled={!value}>
            {t('weight.submit')}
          </Button>
        </form>
      </Card>

      <div>
        <h2 className="mb-3 px-1 text-sm font-semibold text-ink-900">{t('weight.trend')}</h2>
        {points.length === 0 ? (
          <Card className="py-10 text-center text-sm text-ink-500">{t('weight.empty')}</Card>
        ) : (
          <div className="space-y-2">
            {points.map(p => (
              <Card key={p.date} className="flex items-center justify-between p-3.5">
                <span className="text-sm text-ink-500">{new Date(p.date).toLocaleDateString(i18n.language === 'fa' ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric' })}</span>
                <span className="text-sm font-semibold text-ink-900">{formatNumber(p.weightKg)} {t('common.kg')}</span>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
