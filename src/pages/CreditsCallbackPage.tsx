import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { keys } from '@/queries/keys'
import { Button } from '@/components/ui/Button'
import { DiamondIcon } from '@/components/ui/icons'
import { cn } from '@/lib/cn'

// بعد از پرداخت، بک‌اند کاربر رو به همین صفحه برمی‌گردونه (returnUrl که موقع خرید در
// CreditsPage.tsx فرستاده شده) — status/refId دقیقاً مثل CallbackPage.tsx فرانت اصلی نیوو.
export function CreditsCallbackPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const qc = useQueryClient()

  const status = params.get('status')
  const refId = params.get('refId')
  const isSuccess = status === 'success'
  // پرداخت از اپ موبایل نیوو کال شروع شده بود (purchase با source=app) — طبق همون
  // مکانیزم withSourceParam که برای اپ اصلی نیوو ساخته شده. چون nivocal:// یک custom scheme
  // است (نه App Link تایید‌شده)، از فرمت intent:// استفاده می‌کنیم که مرورگر اندروید مستقیم
  // برنامه را با package name باز می‌کند، بدون نیاز به تایید دامنه.
  const isFromApp = params.get('source') === 'app'
  const returnToAppHref = 'intent://payment-callback#Intent;scheme=nivocal;package=ir.nivo.cal;end'

  useEffect(() => {
    if (isSuccess) {
      void qc.invalidateQueries({ queryKey: keys.credits.balance() })
    }
  }, [isSuccess, qc])

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-5 px-6 text-center">
      <span
        className={cn(
          'flex h-16 w-16 items-center justify-center rounded-full',
          isSuccess ? 'bg-brand-50 text-brand-600' : 'bg-rose-500/10 text-rose-500',
        )}
      >
        <DiamondIcon className="h-8 w-8" />
      </span>

      <div>
        <h1 className="text-lg font-bold text-ink-900">
          {isSuccess ? t('credits.callbackSuccessTitle') : t('credits.callbackFailedTitle')}
        </h1>
        {isSuccess && refId && (
          <p dir="ltr" className="mt-1 text-xs text-ink-500">
            {t('credits.callbackRefId')}: {refId}
          </p>
        )}
      </div>

      <div className="w-full max-w-xs space-y-2">
        {isSuccess ? (
          <Button size="lg" onClick={() => navigate('/')}>
            {t('credits.callbackBackToDashboard')}
          </Button>
        ) : (
          <Button size="lg" onClick={() => navigate('/credits')}>
            {t('credits.callbackRetry')}
          </Button>
        )}
      </div>
    </div>
  )
}
