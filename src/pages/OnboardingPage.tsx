import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCreateNutritionProfile, useDailySummary, useNutritionProfile } from '@/queries/nivoCal.queries'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/ui/BrandMark'
import { cn } from '@/lib/cn'
import type { NivoCalActivityLevel, NivoCalGender, NivoCalGoal } from '@/types/api'

const ACTIVITY_LEVELS: NivoCalActivityLevel[] = ['SEDENTARY', 'LIGHT', 'ACTIVE', 'VERY_ACTIVE']
const GOALS: NivoCalGoal[] = ['LOSE_WEIGHT', 'MAINTAIN', 'GAIN_WEIGHT']

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border px-4 py-3 text-start transition-colors',
        selected ? 'border-brand-500 bg-brand-50' : 'border-black/10 bg-white',
      )}
    >
      {children}
    </button>
  )
}

export function OnboardingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createProfile = useCreateNutritionProfile()

  const [gender, setGender] = useState<NivoCalGender>('MALE')
  const [age, setAge] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [activityLevel, setActivityLevel] = useState<NivoCalActivityLevel>('LIGHT')
  const [goal, setGoal] = useState<NivoCalGoal>('MAINTAIN')
  const [goalPaceLevel, setGoalPaceLevel] = useState(2)

  // ویرایش پروفایل موجود (از صفحه‌ی پروفایل) — یک‌بار با داده‌ی فعلی پر می‌شود، بعدش
  // دست‌کاری کاربر بازنویسی نمی‌شود حتی اگر رفچ پس‌زمینه دوباره اجرا شود
  const { data: existingProfile } = useNutritionProfile()
  const { data: summary } = useDailySummary(!!existingProfile)
  const hydrated = useRef(false)
  useEffect(() => {
    if (hydrated.current || !existingProfile || !summary) return
    hydrated.current = true
    setGender(existingProfile.gender)
    setAge(String(existingProfile.age))
    setHeightCm(String(existingProfile.heightCm))
    setActivityLevel(existingProfile.activityLevel)
    setGoal(existingProfile.goal)
    setGoalPaceLevel(existingProfile.goalPaceLevel)
    const latestWeight = summary?.weightTrend.points.at(-1)?.weightKg
    if (latestWeight) setWeightKg(String(latestWeight))
  }, [existingProfile, summary])

  const isValid = Number(age) >= 10 && Number(age) <= 100 && Number(heightCm) >= 100 && Number(heightCm) <= 250 && Number(weightKg) >= 30 && Number(weightKg) <= 300

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isValid) return
    createProfile.mutate(
      {
        gender,
        age: Number(age),
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        activityLevel,
        goal,
        ...(goal !== 'MAINTAIN' ? { goalPaceLevel } : {}),
      },
      { onSuccess: () => navigate('/', { replace: true }) },
    )
  }

  return (
    <div className="mx-auto min-h-dvh max-w-md px-6 pb-10 pt-10">
      <div className="mb-6 flex flex-col items-center gap-4 text-center">
        <BrandMark size={56} />
        <div>
          <h1 className="text-lg font-bold text-ink-900">{t('onboarding.title')}</h1>
          <p className="mt-1 text-sm text-ink-500">{t('onboarding.subtitle')}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <section>
          <label className="mb-2 block text-xs font-semibold text-ink-700">{t('onboarding.gender')}</label>
          <div className="grid grid-cols-2 gap-2">
            <OptionCard selected={gender === 'MALE'} onClick={() => setGender('MALE')}>
              {t('onboarding.male')}
            </OptionCard>
            <OptionCard selected={gender === 'FEMALE'} onClick={() => setGender('FEMALE')}>
              {t('onboarding.female')}
            </OptionCard>
          </div>
        </section>

        <section className="grid grid-cols-3 gap-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-700">{t('onboarding.age')}</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-center text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-700">{t('onboarding.height')}</label>
            <input
              type="number"
              value={heightCm}
              onChange={e => setHeightCm(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-center text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-ink-700">{t('onboarding.weight')}</label>
            <input
              type="number"
              value={weightKg}
              onChange={e => setWeightKg(e.target.value)}
              className="w-full rounded-2xl border border-black/10 bg-white px-3 py-2.5 text-center text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            />
          </div>
        </section>

        <section>
          <label className="mb-2 block text-xs font-semibold text-ink-700">{t('onboarding.activityLevel')}</label>
          <div className="space-y-2">
            {ACTIVITY_LEVELS.map(level => (
              <OptionCard key={level} selected={activityLevel === level} onClick={() => setActivityLevel(level)}>
                <div className="font-medium text-ink-900">{t(`onboarding.activity.${level}.label`)}</div>
                <div className="text-xs text-ink-500">{t(`onboarding.activity.${level}.desc`)}</div>
              </OptionCard>
            ))}
          </div>
        </section>

        <section>
          <label className="mb-2 block text-xs font-semibold text-ink-700">{t('onboarding.goal')}</label>
          <div className="grid grid-cols-3 gap-2">
            {GOALS.map(g => (
              <OptionCard key={g} selected={goal === g} onClick={() => setGoal(g)}>
                <span className="text-sm">{t(`onboarding.goalOptions.${g}`)}</span>
              </OptionCard>
            ))}
          </div>
        </section>

        {goal !== 'MAINTAIN' && (
          <section>
            <label className="mb-1 block text-xs font-semibold text-ink-700">{t('onboarding.goalPace')}</label>
            <p className="mb-2 text-xs text-ink-500">{t('onboarding.goalPaceHint')}</p>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map(pace => (
                <OptionCard key={pace} selected={goalPaceLevel === pace} onClick={() => setGoalPaceLevel(pace)}>
                  <span className="text-sm">{t(`onboarding.pace.${pace}`)}</span>
                </OptionCard>
              ))}
            </div>
          </section>
        )}

        <Button type="submit" size="lg" loading={createProfile.isPending} disabled={!isValid}>
          {createProfile.isPending ? t('onboarding.submitting') : t('onboarding.submit')}
        </Button>
      </form>
    </div>
  )
}
