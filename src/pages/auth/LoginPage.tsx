import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSendOtp } from '@/queries/auth.queries'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/ui/BrandMark'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { SparkleIcon } from '@/components/ui/icons'

const IRAN_PHONE_RE = /^09\d{9}$/

export function LoginPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const sendOtp = useSendOtp()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!IRAN_PHONE_RE.test(phone)) {
      setError(t('login.errorInvalidPhone'))
      return
    }
    sendOtp.mutate(phone, {
      onSuccess: () => navigate('/otp', { state: { phone } }),
      onError: () => setError(t('login.errorInvalidPhone')),
    })
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6">
      <LanguageToggle className="absolute top-6" />

      <div className="flex flex-col items-center gap-4 text-center">
        <BrandMark />
        <div>
          <h1 className="text-xl font-bold text-ink-900">{t('login.title')}</h1>
          <p className="mt-1.5 text-sm text-ink-500">{t('login.subtitle')}</p>
        </div>

        <div className="inline-flex max-w-sm items-start gap-1.5 rounded-2xl bg-brand-50 px-3.5 py-2 text-start text-xs font-medium leading-5 text-brand-700">
          <SparkleIcon className="mt-0.5 size-3.5 shrink-0" />
          <span>{t('login.aiTagline')}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-700">{t('login.phoneLabel')}</label>
          <input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            value={phone}
            onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
            placeholder={t('login.phonePlaceholder')}
            maxLength={11}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-center text-lg tracking-widest text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
        </div>

        <Button type="submit" size="lg" loading={sendOtp.isPending}>
          {sendOtp.isPending ? t('login.sending') : t('login.sendCode')}
        </Button>

        <p className="pt-1 text-center text-xs leading-5 text-ink-500">{t('login.note')}</p>
      </form>
    </div>
  )
}
