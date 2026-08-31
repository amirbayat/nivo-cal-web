import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Card({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('rounded-3xl bg-card p-5 shadow-[0_1px_2px_rgba(20,35,29,0.04),0_8px_24px_rgba(20,35,29,0.05)]', className)} {...rest} />
}
