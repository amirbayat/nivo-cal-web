import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useCreateNutritionProfile, useDailySummary, useNutritionProfile } from '@/queries/nivoCal.queries'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/ui/BrandMark'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { ChevronBackIcon, ChevronForwardIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'
import type { NivoCalActivityLevel, NivoCalGender, NivoCalGoal, NutritionProfile } from '@/types/api'

const TOTAL_STEPS = 4

const ACTIVITY_LEVELS: NivoCalActivityLevel[] = ['SEDENTARY', 'LIGHT', 'ACTIVE', 'VERY_ACTIVE']
const GOALS: NivoCalGoal[] = ['LOSE_WEIGHT', 'MAINTAIN', 'GAIN_WEIGHT']

function OptionCard({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-2xl border px-4 py-3 text-start transition-all duration-150',
        selected
          ? 'border-brand-500 bg-brand-50 shadow-sm shadow-brand-500/10'
          : 'border-black/10 bg-white hover:border-black/20',
      )}
    >
      {children}
    </button>
  )
}

function NumberField({ label, value, onChange, unit }: { label: string; value: string; onChange: (v: string) => void; unit: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-ink-700">{label}</label>
      <div className="relative">
        <input
          type="number"
          inputMode="decimal"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3.5 text-center text-lg font-bold text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
        />
        <span className="pointer-events-none absolute inset-y-0 end-4 flex items-center text-xs text-ink-500">{unit}</span>
      </div>
    </div>
  )
}

function MacroPill({ dotClass, label, grams }: { dotClass: string; label: string; grams: number }) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <div className="flex items-center gap-1.5">
        <span className={cn('size-2 rounded-full', dotClass)} />
        <span className="text-xs text-ink-500">{label}</span>
      </div>
      <span className="text-sm font-bold text-ink-900" dir="ltr">{grams}g</span>
    </div>
  )
}

/** دکمه‌ی دایره‌ای «بازگشت» بالای هر مرحله — فلش طبق قانون RTL به راست اشاره می‌کند. */
function StepBackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/10 text-ink-500 transition-colors hover:border-black/20 hover:text-ink-900"
    >
      <ChevronBackIcon className="size-4" />
    </button>
  )
}

export function OnboardingPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const createProfile = useCreateNutritionProfile()

  const [step, setStep] = useState(1)
  const [gender, setGender] = useState<NivoCalGender>('MALE')
  const [age, setAge] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [activityLevel, setActivityLevel] = useState<NivoCalActivityLevel>('LIGHT')
  const [goal, setGoal] = useState<NivoCalGoal>('MAINTAIN')
  const [goalPaceLevel, setGoalPaceLevel] = useState(2)
  const [result, setResult] = useState<NutritionProfile | null>(null)

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

  const isEditing = !!existingProfile

  const step1Valid = Number(age) >= 10 && Number(age) <= 100
  const step2Valid = Number(heightCm) >= 100 && Number(heightCm) <= 250 && Number(weightKg) >= 30 && Number(weightKg) <= 300
  const currentStepValid = step === 1 ? step1Valid : step === 2 ? step2Valid : true

  function goToPrevStep() {
    if (step > 1) {
      setStep(s => s - 1)
      return
    }
    if (isEditing) navigate('/profile')
  }

  function goToNextStep() {
    if (!currentStepValid) return
    setStep(s => Math.min(TOTAL_STEPS, s + 1))
  }

  function handleSubmit() {
    if (!step1Valid || !step2Valid) return
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
      { onSuccess: profile => setResult(profile) },
    )
  }

  if (result) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center px-6 py-10 text-center">
        <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <svg viewBox="0 0 24 24" fill="none" className="size-7">
            <path d="M4.5 12.5l5 5L19.5 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mb-1 text-xl font-bold text-ink-900">
          {t(isEditing ? 'onboarding.summary.headingUpdate' : 'onboarding.summary.heading')}
        </h1>
        <p className="mb-7 text-[13.5px] text-ink-500">{t('onboarding.summary.subheading')}</p>

        <div className="mb-5 flex flex-col items-center">
          <span className="text-4xl font-extrabold text-ink-900" dir="ltr">
            {result.dailyCalorieTarget.toLocaleString('en-US')}
          </span>
          <span className="text-xs text-ink-500">{t('onboarding.summary.perDay')}</span>
        </div>

        <div className="mb-6 flex gap-5">
          <MacroPill dotClass="bg-brand-500" label={t('dashboard.protein')} grams={result.proteinTargetG} />
          <MacroPill dotClass="bg-amber-500" label={t('dashboard.carbs')} grams={result.carbsTargetG} />
          <MacroPill dotClass="bg-rose-500" label={t('dashboard.fat')} grams={result.fatTargetG} />
        </div>

        <div className="mb-8 w-full rounded-2xl border border-black/10 bg-card p-4 text-start">
          <p className="text-[13.5px] leading-[1.85] text-ink-700">
            {t(`onboarding.summary.motivation.${result.goal}`)}
          </p>
        </div>

        <Button type="button" size="lg" onClick={() => navigate('/', { replace: true })} className="w-full">
          <span>{t('onboarding.summary.cta')}</span>
          <ChevronForwardIcon className="size-4" />
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto min-h-dvh max-w-md px-6 pb-10 pt-8">
      <div className="mb-5 flex items-center justify-between">
        {step > 1 || isEditing ? (
          <StepBackButton onClick={goToPrevStep} label={t('common.back')} />
        ) : (
          <span className="size-9" />
        )}
        <span className="text-xs font-medium text-ink-500">{t('onboarding.stepOf', { step, total: TOTAL_STEPS })}</span>
      </div>

      <ProgressBar step={step} totalSteps={TOTAL_STEPS} />

      <div className="mb-8 mt-6 flex flex-col items-center gap-3 text-center">
        <BrandMark size={44} />
      </div>

      <div key={step} className="animate-[fade-slide-in_0.3s_ease]">
        {step === 1 && (
          <section className="space-y-6">
            <div>
              <h1 className="text-lg font-bold text-ink-900">{t('onboarding.step1.heading')}</h1>
              <p className="mt-1 text-sm text-ink-500">{t('onboarding.step1.subheading')}</p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-semibold text-ink-700">{t('onboarding.gender')}</label>
              <div className="grid grid-cols-2 gap-2">
                <OptionCard selected={gender === 'MALE'} onClick={() => setGender('MALE')}>
                  {t('onboarding.male')}
                </OptionCard>
                <OptionCard selected={gender === 'FEMALE'} onClick={() => setGender('FEMALE')}>
                  {t('onboarding.female')}
                </OptionCard>
              </div>
            </div>

            <NumberField label={t('onboarding.age')} value={age} onChange={setAge} unit={t('common.years')} />
          </section>
        )}

        {step === 2 && (
          <section className="space-y-6">
            <div>
              <h1 className="text-lg font-bold text-ink-900">{t('onboarding.step2.heading')}</h1>
              <p className="mt-1 text-sm text-ink-500">{t('onboarding.step2.subheading')}</p>
            </div>

            <NumberField label={t('onboarding.height')} value={heightCm} onChange={setHeightCm} unit={t('common.cm')} />
            <NumberField label={t('onboarding.weight')} value={weightKg} onChange={setWeightKg} unit={t('common.kg')} />
          </section>
        )}

        {step === 3 && (
          <section className="space-y-6">
            <div>
              <h1 className="text-lg font-bold text-ink-900">{t('onboarding.step3.heading')}</h1>
              <p className="mt-1 text-sm text-ink-500">{t('onboarding.step3.subheading')}</p>
            </div>

            <div className="space-y-2">
              {ACTIVITY_LEVELS.map(level => (
                <OptionCard key={level} selected={activityLevel === level} onClick={() => setActivityLevel(level)}>
                  <div className="font-medium text-ink-900">{t(`onboarding.activity.${level}.label`)}</div>
                  <div className="text-xs text-ink-500">{t(`onboarding.activity.${level}.desc`)}</div>
                </OptionCard>
              ))}
            </div>
          </section>
        )}

        {step === 4 && (
          <section className="space-y-6">
            <div>
              <h1 className="text-lg font-bold text-ink-900">{t('onboarding.step4.heading')}</h1>
              <p className="mt-1 text-sm text-ink-500">{t('onboarding.step4.subheading')}</p>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {GOALS.map(g => (
                <OptionCard key={g} selected={goal === g} onClick={() => setGoal(g)}>
                  <span className="text-sm">{t(`onboarding.goalOptions.${g}`)}</span>
                </OptionCard>
              ))}
            </div>

            {goal !== 'MAINTAIN' && (
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-700">{t('onboarding.goalPace')}</label>
                <p className="mb-2 text-xs text-ink-500">{t('onboarding.goalPaceHint')}</p>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map(pace => (
                    <OptionCard key={pace} selected={goalPaceLevel === pace} onClick={() => setGoalPaceLevel(pace)}>
                      <span className="text-sm">{t(`onboarding.pace.${pace}`)}</span>
                    </OptionCard>
                  ))}
                </div>
              </div>
            )}

            {createProfile.isError && <p className="text-center text-xs text-rose-500">{t('common.error')}</p>}
          </section>
        )}
      </div>

      <div className="mt-8">
        {step < TOTAL_STEPS ? (
          <Button type="button" size="lg" disabled={!currentStepValid} onClick={goToNextStep}>
            <span>{t('common.continue')}</span>
            <ChevronForwardIcon className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            size="lg"
            loading={createProfile.isPending}
            disabled={!step1Valid || !step2Valid || createProfile.isPending}
            onClick={handleSubmit}
          >
            {createProfile.isPending
              ? t(isEditing ? 'onboarding.updating' : 'onboarding.submitting')
              : t(isEditing ? 'onboarding.update' : 'onboarding.submit')}
          </Button>
        )}
      </div>
    </div>
  )
}
