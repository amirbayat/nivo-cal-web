import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useSendOtp, useVerifyOtp } from '@/queries/auth.queries'
import { Button } from '@/components/ui/Button'
import { BrandMark } from '@/components/ui/BrandMark'

const RESEND_SECONDS = 60

export function OtpPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const phone = (location.state as { phone?: string } | null)?.phone

  const sendOtp = useSendOtp()
  const verifyOtp = useVerifyOtp()
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS)

  useEffect(() => {
    if (!phone) {
      navigate('/login', { replace: true })
      return
    }
    const id = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000)
    return () => clearInterval(id)
  }, [phone, navigate])

  if (!phone) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    verifyOtp.mutate(
      { phone: phone!, code },
      {
        onSuccess: () => navigate('/', { replace: true }),
        onError: () => setError(t('otp.errorInvalidCode')),
      },
    )
  }

  function handleResend() {
    sendOtp.mutate(phone!, { onSuccess: () => setSecondsLeft(RESEND_SECONDS) })
  }

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-8 px-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <BrandMark />
        <div>
          <h1 className="text-xl font-bold text-ink-900">{t('otp.title')}</h1>
          <p className="mt-1.5 text-sm text-ink-500" dir="ltr">
            {t('otp.subtitle', { phone })}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3">
        <div>
          <input
            type="tel"
            inputMode="numeric"
            dir="ltr"
            autoFocus
            value={code}
            onChange={e => setCode(e.target.value.replace(/\D/g, ''))}
            maxLength={6}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] text-ink-900 outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {error && <p className="mt-1.5 text-center text-xs text-rose-500">{error}</p>}
        </div>

        <Button type="submit" size="lg" loading={verifyOtp.isPending} disabled={code.length < 4}>
          {verifyOtp.isPending ? t('otp.verifying') : t('otp.verify')}
        </Button>

        <div className="flex items-center justify-between pt-1 text-xs text-ink-500">
          <button type="button" onClick={() => navigate('/login')} className="font-medium text-ink-700">
            {t('otp.changeNumber')}
          </button>
          {secondsLeft > 0 ? (
            <span>{t('otp.resendIn', { seconds: secondsLeft })}</span>
          ) : (
            <button type="button" onClick={handleResend} className="font-medium text-brand-600">
              {t('otp.resend')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
