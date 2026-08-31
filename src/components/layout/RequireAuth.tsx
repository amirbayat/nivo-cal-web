import { Navigate, Outlet } from 'react-router-dom'
import { useEffect } from 'react'
import { useMe } from '@/queries/auth.queries'
import { useAuthStore } from '@/store/auth.store'
import { FullScreenSpinner } from '@/components/ui/FullScreenSpinner'

export function RequireAuth() {
  const hasToken = !!localStorage.getItem('nivocal_access_token')
  const { data: user, isPending, isError } = useMe()
  const setUser = useAuthStore(s => s.setUser)

  useEffect(() => {
    if (user) setUser(user)
  }, [user, setUser])

  if (!hasToken) return <Navigate to="/login" replace />
  if (isPending) return <FullScreenSpinner />
  if (isError) return <Navigate to="/login" replace />

  return <Outlet />
}
