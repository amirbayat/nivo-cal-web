import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { RequireAuth } from '@/components/layout/RequireAuth'
import { RequireProfile } from '@/components/layout/RequireProfile'
import { AppShell } from '@/components/layout/AppShell'
import { LoginPage } from '@/pages/auth/LoginPage'
import { OtpPage } from '@/pages/auth/OtpPage'
import { OnboardingPage } from '@/pages/OnboardingPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { ScanPage } from '@/pages/ScanPage'
import { LogsPage } from '@/pages/LogsPage'
import { WeightPage } from '@/pages/WeightPage'
import { ProfilePage } from '@/pages/ProfilePage'
import { CreditsPage } from '@/pages/CreditsPage'
import { CreditsCallbackPage } from '@/pages/CreditsCallbackPage'

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<OnboardingPage />} />
          {/* بک‌اند بعد از پرداخت همیشه به {origin}/payment ریدایرکت می‌کند (payments.service.ts) —
              این مسیر ثابت است، مستقل از این‌که کاربر پروفایل تغذیه ساخته یا نه */}
          <Route path="/payment" element={<CreditsCallbackPage />} />

          <Route element={<RequireProfile />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/weight" element={<WeightPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/credits" element={<CreditsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
