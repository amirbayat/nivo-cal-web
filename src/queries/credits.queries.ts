import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from './keys'
import type { CreditPackage, CreditsBalance } from '@/types/api'

export type PaymentGatewayName = 'zarinpal' | 'vandar' | 'zibal'

// نیوو کال فقط بسته‌های اختصاصی خودش رو می‌بینه، نه بسته‌های عمومی نیوو اصلی
// (docs/PRD-nivo-cal-standalone-app.md بخش ۶ — CreditPackageScope)
const SCOPE = 'NIVO_CAL'

export function useCreditsBalance(enabled = true) {
  return useQuery({
    queryKey: keys.credits.balance(),
    queryFn: () => api.get<CreditsBalance>('/v2/credits/balance').then(r => r.data),
    enabled,
  })
}

export function useCreditPackages() {
  return useQuery({
    queryKey: keys.credits.packages(),
    queryFn: () => api.get<CreditPackage[]>('/v2/credits/packages', { params: { scope: SCOPE } }).then(r => r.data),
  })
}

export function useCreditQuote(credits: number, enabled: boolean) {
  return useQuery({
    queryKey: keys.credits.quote(credits),
    queryFn: () =>
      api.get<{ priceToman: number }>('/v2/credits/quote', { params: { credits, scope: SCOPE } }).then(r => r.data),
    enabled,
  })
}

export function useEnabledGateways() {
  return useQuery({
    queryKey: keys.credits.gateways(),
    queryFn: () => api.get<PaymentGatewayName[]>('/payments/gateways').then(r => r.data),
  })
}

export function usePurchaseCreditPackage() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (dto: { packageId: string; customCredits?: number; gateway?: PaymentGatewayName; returnUrl?: string }) =>
      api.post<{ paymentUrl: string }>('/v2/credits/purchase', dto).then(r => r.data),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: keys.credits.balance() })
    },
  })
}
