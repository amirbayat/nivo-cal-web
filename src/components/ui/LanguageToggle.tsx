import { useTranslation } from 'react-i18next'
import { setLanguage, type SupportedLanguage } from '@/i18n'
import { cn } from '@/lib/cn'

export function LanguageToggle({ className }: { className?: string }) {
  const { i18n } = useTranslation()
  const current = i18n.language as SupportedLanguage

  return (
    <div className={cn('inline-flex items-center gap-0.5 rounded-full bg-black/5 p-0.5 text-xs font-medium', className)}>
      {(['fa', 'en'] as const).map(lang => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={cn('rounded-full px-2.5 py-1 transition-colors', current === lang ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500')}
        >
          {lang === 'fa' ? 'فارسی' : 'English'}
        </button>
      ))}
    </div>
  )
}
