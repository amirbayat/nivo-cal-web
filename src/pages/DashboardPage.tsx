import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDailySummary, useDeleteFoodLog } from '@/queries/nivoCal.queries'
import { useCreditsBalance } from '@/queries/credits.queries'
import { useFormatNumber } from '@/hooks/useFormatNumber'
import { ProgressRing } from '@/components/ui/ProgressRing'
import { MacroBar } from '@/components/ui/MacroBar'
import { Card } from '@/components/ui/Card'
import { FullScreenSpinner } from '@/components/ui/FullScreenSpinner'
import { AuthedImage } from '@/components/ui/AuthedImage'
import { FlameIcon, DiamondIcon, TrashIcon } from '@/components/ui/icons'
import { saturdayFirstIndex } from '@/lib/dates'
import { cn } from '@/lib/cn'

const WEEKLY_DOT_COLOR: Record<string, string> = {
  under: 'bg-brand-200',
  onTarget: 'bg-brand-600',
  over: 'bg-rose-500',
  noData: 'bg-black/10',
}

export function DashboardPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { data, isPending } = useDailySummary()
  const { data: creditsBalance } = useCreditsBalance()
  const deleteLog = useDeleteFoodLog()
  const formatNumber = useFormatNumber()

  if (isPending || !data) return <FullScreenSpinner />

  const { profile, consumed, remainingCalories, meals, streakDays, weeklyAdherence } = data
  const progress = profile.dailyCalorieTarget > 0 ? consumed.calories / profile.dailyCalorieTarget : 0
  const orderedWeek = [...weeklyAdherence].sort((a, b) => saturdayFirstIndex(a.date) - saturdayFirstIndex(b.date))

  function handleDeleteMeal(id: string) {
    if (window.confirm(t('logs.deleteConfirm'))) deleteLog.mutate(id)
  }

  return (
    <div className="space-y-5 px-5 pb-4 pt-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-500">
          <FlameIcon className="h-3.5 w-3.5" />
          {streakDays > 0 ? t('dashboard.streak', { count: formatNumber(streakDays) }) : t('dashboard.streakZero')}
        </div>
        <button
          onClick={() => navigate('/credits')}
          className="flex items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-transform active:scale-95"
        >
          <DiamondIcon className="h-3.5 w-3.5" />
          {formatNumber(creditsBalance?.credits ?? 0)} {t('credits.creditsUnit')}
        </button>
      </div>

      <Card className="flex flex-col items-center gap-4 py-8">
        <ProgressRing progress={progress}>
          <div className="flex flex-col items-center">
            <span className="text-3xl font-extrabold text-ink-900">{formatNumber(Math.max(0, Math.round(remainingCalories)))}</span>
            <span className="text-xs text-ink-500">{t('dashboard.remaining')}</span>
          </div>
        </ProgressRing>
        <p className="text-xs text-ink-500">{t('dashboard.of', { target: formatNumber(Math.round(profile.dailyCalorieTarget)) })}</p>

        <div className="grid w-full grid-cols-3 gap-3 pt-2">
          <MacroBar label={t('dashboard.protein')} value={consumed.proteinG} target={profile.proteinTargetG} unit="g" color="var(--color-brand-500)" />
          <MacroBar label={t('dashboard.carbs')} value={consumed.carbsG} target={profile.carbsTargetG} unit="g" color="var(--color-amber-500)" />
          <MacroBar label={t('dashboard.fat')} value={consumed.fatG} target={profile.fatTargetG} unit="g" color="var(--color-rose-500)" />
        </div>
      </Card>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-ink-900">{t('dashboard.weekly')}</h2>
        <div className="flex items-center justify-between">
          {orderedWeek.map(day => (
            <div key={day.date} className="flex flex-col items-center gap-1.5">
              <span className={cn('h-2.5 w-2.5 rounded-full', WEEKLY_DOT_COLOR[day.status])} />
              <span className="text-[10px] text-ink-500">
                {new Date(day.date).toLocaleDateString(i18n.language === 'fa' ? 'fa-IR' : 'en-US', { weekday: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </Card>

      <div>
        <h2 className="mb-3 px-1 text-sm font-semibold text-ink-900">{t('dashboard.todayMeals')}</h2>
        {meals.length === 0 ? (
          <Card className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm text-ink-500">{t('dashboard.noMeals')}</p>
            <button onClick={() => navigate('/scan')} className="text-sm font-semibold text-brand-600">
              {t('dashboard.scanCta')}
            </button>
          </Card>
        ) : (
          <div className="space-y-2">
            {meals.map(meal => (
              <Card key={meal.id} className="flex items-center gap-3 p-3">
                <AuthedImage src={meal.imageUrl} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink-900">{meal.items[0]?.nameFa ?? '—'}</p>
                  <p className="text-xs text-ink-500">{new Date(meal.createdAt).toLocaleTimeString(i18n.language === 'fa' ? 'fa-IR' : 'en-US', { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <span className="shrink-0 text-sm font-semibold text-ink-700">{formatNumber(meal.totalCalories)} {t('common.kcal')}</span>
                <button onClick={() => handleDeleteMeal(meal.id)} className="shrink-0 rounded-full p-2 text-ink-300 transition-colors hover:bg-rose-500/10 hover:text-rose-500">
                  <TrashIcon className="h-4 w-4" />
                </button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
