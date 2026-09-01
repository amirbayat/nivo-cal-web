import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  useCreditPackages,
  useCreditQuote,
  useCreditsBalance,
  useEnabledGateways,
  usePurchaseCreditPackage,
  type PaymentGatewayName,
} from '@/queries/credits.queries'
import { useFormatNumber } from '@/hooks/useFormatNumber'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { ChevronBackIcon, DiamondIcon, SparkleIcon } from '@/components/ui/icons'
import type { CreditPackage } from '@/types/api'
import { cn } from '@/lib/cn'

export function CreditsPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const formatNumber = useFormatNumber()

  const { data: balance } = useCreditsBalance()
  const { data: packages, isPending: packagesPending } = useCreditPackages()
  const { data: gateways } = useEnabledGateways()
  const purchase = usePurchaseCreditPackage()

  const [customAmount, setCustomAmount] = useState('')
  const [debouncedAmount, setDebouncedAmount] = useState(0)
  const [purchasingId, setPurchasingId] = useState<string | null>(null)
  const [purchaseError, setPurchaseError] = useState(false)

  useEffect(() => {
    const amount = Number(customAmount)
    const timer = setTimeout(() => setDebouncedAmount(Number.isFinite(amount) ? amount : 0), 400)
    return () => clearTimeout(timer)
  }, [customAmount])

  const { data: quote } = useCreditQuote(debouncedAmount, debouncedAmount > 0)

  const fixedPackages = (packages ?? []).filter(p => !p.isCustomAmount)
  const customPackage = (packages ?? []).find(p => p.isCustomAmount)

  function runPurchase(pkg: CreditPackage, customCredits: number | undefined, gateway?: PaymentGatewayName) {
    setPurchaseError(false)
    setPurchasingId(pkg.id)
    purchase.mutate(
      { packageId: pkg.id, customCredits, gateway, returnUrl: window.location.origin },
      {
        onSuccess: ({ paymentUrl }) => {
          window.location.href = paymentUrl
        },
        onError: () => {
          setPurchasingId(null)
          setPurchaseError(true)
        },
      },
    )
  }

  function onBuy(pkg: CreditPackage, customCredits?: number) {
    const enabled = gateways ?? []
    // انتخاب درگاه فعلاً ساده نگه داشته شده — اولین درگاه فعال؛ اگر چند درگاه هم‌زمان فعال شد،
    // یک انتخابگر مثل GatewayPickerModal فرانت اصلی (nivo-ai-frontend) باید اضافه شود.
    runPurchase(pkg, customCredits, enabled[0])
  }

  return (
    <div className="space-y-5 px-5 pb-6 pt-8">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-ink-700 shadow-[0_1px_2px_rgba(20,35,29,0.06)]">
          <ChevronBackIcon className="h-5 w-5" />
        </button>
        <h1 className="text-lg font-bold text-ink-900">{t('credits.title')}</h1>
      </div>
      <p className="text-sm text-ink-500">{t('credits.subtitle')}</p>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 to-brand-700 p-5 text-white shadow-[0_16px_40px_rgba(15,122,87,0.35)]">
        <span className="pointer-events-none absolute -top-10 -left-8 h-32 w-32 rounded-full bg-white/10" />
        <span className="pointer-events-none absolute -bottom-10 -right-6 h-28 w-28 rounded-full bg-white/10" />
        <SparkleIcon className="pointer-events-none absolute left-4 top-4 h-5 w-5 text-white/30" />

        <div className="relative flex items-center gap-3">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
            <DiamondIcon className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs text-white/70">{t('credits.currentBalance')}</p>
            <p className="text-2xl font-extrabold tracking-tight">
              {formatNumber(balance?.credits ?? 0)}
              <span className="ms-1.5 text-sm font-medium text-white/70">{t('credits.creditsUnit')}</span>
            </p>
          </div>
        </div>
      </div>

      {purchaseError && <p className="text-center text-xs text-rose-500">{t('credits.purchaseError')}</p>}

      {packagesPending ? (
        <p className="text-center text-sm text-ink-500">{t('common.loading')}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {fixedPackages.map(pkg => (
            <Card key={pkg.id} className={cn('flex flex-col items-center gap-2 text-center', pkg.isPopular || pkg.isBestValue ? 'ring-2 ring-brand-500' : '')}>
              {(pkg.isPopular || pkg.isBestValue) && (
                <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[10px] font-semibold text-brand-700">
                  {pkg.isBestValue ? t('credits.bestValue') : t('credits.popular')}
                </span>
              )}
              <p className="text-xl font-bold text-ink-900">{formatNumber(pkg.credits)}</p>
              <p className="text-xs text-ink-500">{t('credits.creditsUnit')}</p>
              <p className="text-sm font-semibold text-ink-700">{formatNumber(pkg.priceToman)} {t('common.toman')}</p>
              <Button size="md" onClick={() => onBuy(pkg)} loading={purchasingId === pkg.id}>
                {t('credits.buyButton')}
              </Button>
            </Card>
          ))}
        </div>
      )}

      {customPackage && (
        <Card className="space-y-3">
          <p className="text-sm font-semibold text-ink-900">{t('credits.customAmountLabel')}</p>
          <input
            type="tel"
            inputMode="numeric"
            value={customAmount}
            onChange={e => setCustomAmount(e.target.value.replace(/\D/g, ''))}
            placeholder={t('credits.customAmountPlaceholder')}
            className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
          />
          {quote && <p className="text-xs text-ink-500">{formatNumber(quote.priceToman)} {t('common.toman')}</p>}
          <Button
            onClick={() => onBuy(customPackage, debouncedAmount)}
            disabled={debouncedAmount <= 0}
            loading={purchasingId === customPackage.id}
          >
            {t('credits.buyButton')}
          </Button>
        </Card>
      )}
    </div>
  )
}
