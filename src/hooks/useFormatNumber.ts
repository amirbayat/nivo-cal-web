import { useTranslation } from 'react-i18next'
import { formatNumber } from '@/lib/numbers'
import type { SupportedLanguage } from '@/i18n'

export function useFormatNumber() {
  const { i18n } = useTranslation()
  return (value: number) => formatNumber(value, i18n.language as SupportedLanguage)
}
