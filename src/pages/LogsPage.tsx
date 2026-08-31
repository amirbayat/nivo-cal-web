import { useTranslation } from 'react-i18next'
import { useDeleteFoodLog, useFoodLogs } from '@/queries/nivoCal.queries'
import { Card } from '@/components/ui/Card'
import { FullScreenSpinner } from '@/components/ui/FullScreenSpinner'
import { AuthedImage } from '@/components/ui/AuthedImage'
import { TrashIcon } from '@/components/ui/icons'

export function LogsPage() {
  const { t, i18n } = useTranslation()
  const { data: logs, isPending } = useFoodLogs()
  const deleteLog = useDeleteFoodLog()

  if (isPending) return <FullScreenSpinner />

  function handleDelete(id: string) {
    if (window.confirm(t('logs.deleteConfirm'))) deleteLog.mutate(id)
  }

  return (
    <div className="space-y-4 px-5 pb-4 pt-8">
      <h1 className="text-lg font-bold text-ink-900">{t('logs.title')}</h1>

      {!logs || logs.length === 0 ? (
        <Card className="py-10 text-center text-sm text-ink-500">{t('logs.empty')}</Card>
      ) : (
        <div className="space-y-2">
          {logs.map(log => (
            <Card key={log.id} className="flex items-center gap-3 p-3">
              <AuthedImage src={log.imageUrl} className="h-14 w-14 shrink-0 rounded-2xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink-900">{log.items[0]?.nameFa ?? '—'}</p>
                <p className="text-xs text-ink-500">
                  {new Date(log.createdAt).toLocaleString(i18n.language === 'fa' ? 'fa-IR' : 'en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold text-ink-700">
                {log.totalCalories} {t('common.kcal')}
              </span>
              <button onClick={() => handleDelete(log.id)} className="shrink-0 rounded-full p-2 text-ink-300 hover:bg-rose-500/10 hover:text-rose-500">
                <TrashIcon className="h-4 w-4" />
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
