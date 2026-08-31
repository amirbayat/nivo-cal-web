import { Navigate, Outlet } from 'react-router-dom'
import { useNutritionProfile } from '@/queries/nivoCal.queries'
import { FullScreenSpinner } from '@/components/ui/FullScreenSpinner'

export function RequireProfile() {
  const { data: profile, isPending } = useNutritionProfile()

  if (isPending) return <FullScreenSpinner />
  if (!profile) return <Navigate to="/onboarding" replace />

  return <Outlet />
}
