import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { fa } from './locales/fa'
import { en } from './locales/en'

export type SupportedLanguage = 'fa' | 'en'
export const LANGUAGE_STORAGE_KEY = 'nivocal_language'

function detectInitialLanguage(): SupportedLanguage {
  // پیش‌فرض همیشه فارسی است، صرف‌نظر از زبان مرورگر — فقط با انتخاب صریح کاربر عوض می‌شود
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY)
  return stored === 'en' ? 'en' : 'fa'
}

export const initialLanguage = detectInitialLanguage()

export function applyDocumentDirection(lang: SupportedLanguage) {
  document.documentElement.lang = lang
  document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr'
}

export function setLanguage(lang: SupportedLanguage) {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang)
  applyDocumentDirection(lang)
  void i18n.changeLanguage(lang)
}

applyDocumentDirection(initialLanguage)

void i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: fa },
    en: { translation: en },
  },
  lng: initialLanguage,
  fallbackLng: 'fa',
  interpolation: { escapeValue: false },
})

export default i18n
