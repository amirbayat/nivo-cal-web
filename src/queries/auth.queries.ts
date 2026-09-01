import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { keys } from './keys'
import type { User } from '@/types/api'

export function useMe() {
  return useQuery({
    queryKey: keys.auth.me(),
    queryFn: () => api.get<User>('/auth/me').then(r => r.data),
    enabled: !!localStorage.getItem('nivocal_access_token'),
    staleTime: 5 * 60_000,
    retry: false,
  })
}

export function useSendOtp() {
  return useMutation({
    mutationFn: (phone: string) => api.post('/auth/send-otp', { phone }).then(r => r.data),
  })
}

interface AuthTokens {
  accessToken: string
  refreshToken: string
  user: User
  // فقط برای ثبت‌نام کاملاً جدید مقدار داره؛ برای لاگین‌های بعدی null است.
  signupBonusCredits: number | null
}

export function useVerifyOtp() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ phone, code }: { phone: string; code: string }) =>
      api.post<AuthTokens>('/auth/verify-otp', { phone, code }).then(r => r.data),
    onSuccess: data => {
      localStorage.setItem('nivocal_access_token', data.accessToken)
      localStorage.setItem('nivocal_refresh_token', data.refreshToken)
      void qc.invalidateQueries({ queryKey: keys.auth.me() })
    },
  })
}

export function useLogout() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => api.post('/auth/logout').then(r => r.data),
    onSettled: () => {
      localStorage.removeItem('nivocal_access_token')
      localStorage.removeItem('nivocal_refresh_token')
      qc.clear()
      window.location.href = '/login'
    },
  })
}
