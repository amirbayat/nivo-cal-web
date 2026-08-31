import { Spinner } from '@/components/ui/Button'

export function FullScreenSpinner() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-paper">
      <Spinner className="h-7 w-7 text-brand-600" />
    </div>
  )
}
