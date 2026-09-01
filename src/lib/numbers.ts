import type { SupportedLanguage } from '@/i18n'

// برای مقادیر نمایشی (کالری، درشت‌مغذی‌ها، اعتبار، شمارنده‌ها و ...) — نه برای مقادیر
// input که کاربر داره تایپ می‌کنه، چون تبدیل زنده‌ی رقم‌ها موقع تایپ منطق ورودی رو به‌هم می‌ریزه.
export function formatNumber(value: number, language: SupportedLanguage): string {
  return value.toLocaleString(language === 'fa' ? 'fa-IR' : 'en-US')
}
