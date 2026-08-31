import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/cn'
import { HomeIcon, CameraIcon, HistoryIcon, ScaleIcon, UserIcon } from '@/components/ui/icons'

const tabs = [
  { to: '/', icon: HomeIcon, labelKey: 'nav.dashboard', end: true },
  { to: '/logs', icon: HistoryIcon, labelKey: 'nav.logs', end: false },
  { to: '/scan', icon: CameraIcon, labelKey: 'nav.scan', end: false, primary: true },
  { to: '/weight', icon: ScaleIcon, labelKey: 'nav.weight', end: false },
  { to: '/profile', icon: UserIcon, labelKey: 'nav.profile', end: false },
]

export function AppShell() {
  const { t } = useTranslation()

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-paper">
      <main className="flex-1 overflow-y-auto pb-28">
        <Outlet />
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md">
        <div className="mx-3 mb-3 flex items-center justify-between rounded-[28px] bg-white/90 px-2 py-2 shadow-[0_8px_30px_rgba(20,35,29,0.12)] backdrop-blur-lg">
          {tabs.map(tab => {
            const Icon = tab.icon
            if (tab.primary) {
              return (
                <NavLink key={tab.to} to={tab.to} className="relative -mt-8 flex flex-col items-center gap-1">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg shadow-brand-600/30 transition-transform active:scale-95">
                    <Icon className="h-6 w-6" />
                  </span>
                </NavLink>
              )
            }
            return (
              <NavLink
                key={tab.to}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  cn('flex flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-medium transition-colors', isActive ? 'text-brand-600' : 'text-ink-300')
                }
              >
                <Icon className="h-5 w-5" />
                <span>{t(tab.labelKey)}</span>
              </NavLink>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
