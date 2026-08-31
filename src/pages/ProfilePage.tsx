import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { useLogout } from '@/queries/auth.queries'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { LanguageToggle } from '@/components/ui/LanguageToggle'
import { UserIcon } from '@/components/ui/icons'

export function ProfilePage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const user = useAuthStore(s => s.user)
  const logout = useLogout()

  function handleLogout() {
    if (window.confirm(t('profile.logoutConfirm'))) logout.mutate()
  }

  return (
    <div className="space-y-5 px-5 pb-4 pt-8">
      <h1 className="text-lg font-bold text-ink-900">{t('profile.title')}</h1>

      <Card className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <UserIcon className="h-6 w-6" />
        </span>
        <div>
          <p className="text-xs text-ink-500">{t('profile.phone')}</p>
          <p dir="ltr" className="text-end text-sm font-semibold text-ink-900">{user?.phone ?? '—'}</p>
        </div>
      </Card>

      <Card className="flex items-center justify-between">
        <span className="text-sm font-medium text-ink-900">{t('profile.language')}</span>
        <LanguageToggle />
      </Card>

      <Card className="p-0">
        <button onClick={() => navigate('/onboarding')} className="w-full px-5 py-4 text-start text-sm font-medium text-ink-900">
          {t('profile.editProfile')}
        </button>
      </Card>

      <Button variant="danger" onClick={handleLogout} loading={logout.isPending}>
        {t('profile.logout')}
      </Button>
    </div>
  )
}
