import axios from 'axios'
import { env } from '@/env'

// این اپ لاگین کاملاً جدا از فرانت اصلی نیوو دارد (docs/PRD-nivo-cal-standalone-app.md بخش ۵) —
// توکن‌ها اینجا مستقل نگه‌داری می‌شوند، هیچ اشتراکی با localStorage دامین اصلی نیست (origin جداست)
const GUEST_ACCESSIBLE_PATHS = ['/login', '/otp']

export const api = axios.create({
  baseURL: env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('nivocal_access_token')
  if (token) cfg.headers.Authorization = `Bearer ${token}`
  return cfg
})

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const refresh = localStorage.getItem('nivocal_refresh_token')
        if (!refresh) throw new Error('no refresh token')
        const { data } = await axios.post(`${env.VITE_API_URL}/auth/refresh`, { refreshToken: refresh })
        localStorage.setItem('nivocal_access_token', data.accessToken)
        localStorage.setItem('nivocal_refresh_token', data.refreshToken)
        original.headers.Authorization = `Bearer ${data.accessToken}`
        return api(original)
      } catch {
        localStorage.removeItem('nivocal_access_token')
        localStorage.removeItem('nivocal_refresh_token')
        if (!GUEST_ACCESSIBLE_PATHS.includes(window.location.pathname)) {
          window.location.href = '/login'
        }
      }
    }
    return Promise.reject(err)
  },
)
