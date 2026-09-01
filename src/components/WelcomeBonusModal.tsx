import { useTranslation } from 'react-i18next'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { GiftIcon } from '@/components/ui/icons'

interface WelcomeBonusModalProps {
  open: boolean
  credits: number
  onClose: () => void
}

export function WelcomeBonusModal({ open, credits, onClose }: WelcomeBonusModalProps) {
  const { t } = useTranslation()

  return (
    <Modal open={open} onClose={onClose}>
      <div className="flex flex-col items-center gap-1 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
          <GiftIcon className="h-8 w-8" />
        </span>
        <p className="mt-3 text-4xl font-extrabold text-brand-600">{credits}</p>
        <h2 className="text-lg font-bold text-ink-900">{t('credits.welcomeBonusTitle')}</h2>
        <p className="text-sm text-ink-500">{t('credits.welcomeBonusSubtitle')}</p>
        <div className="mt-5 w-full">
          <Button size="lg" onClick={onClose}>
            {t('credits.welcomeBonusCta')}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
