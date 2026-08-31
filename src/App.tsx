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

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/otp" element={<OtpPage />} />

        <Route element={<RequireAuth />}>
          <Route path="/onboarding" element={<OnboardingPage />} />

          <Route element={<RequireProfile />}>
            <Route element={<AppShell />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/scan" element={<ScanPage />} />
              <Route path="/logs" element={<LogsPage />} />
              <Route path="/weight" element={<WeightPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
