import { cn } from '@/lib/cn'

/**
 * نوار پیشرفت مینیمال ویزارد — هر مرحله یک قطعه‌ی افقی.
 * قطعه‌های طی‌شده/فعلی با رنگ برند پر می‌شن، بقیه خنثی و کم‌رنگ می‌مونن.
 */
export function ProgressBar({ step, totalSteps }: { step: number; totalSteps: number }) {
  return (
    <div
      className="flex gap-1.5"
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={1}
      aria-valuemax={totalSteps}
      aria-label={`${step}/${totalSteps}`}
    >
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={cn('h-1.5 flex-1 rounded-full transition-colors duration-300', i < step ? 'bg-brand-500' : 'bg-black/10')}
        />
      ))}
    </div>
  )
}
