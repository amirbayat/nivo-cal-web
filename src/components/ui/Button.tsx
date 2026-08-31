import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'md' | 'lg'
  loading?: boolean
  icon?: ReactNode
}

const variants = {
  primary: 'bg-brand-600 text-white shadow-sm shadow-brand-600/20 hover:bg-brand-700 active:scale-[0.98]',
  secondary: 'bg-brand-50 text-brand-700 hover:bg-brand-100 active:scale-[0.98]',
  ghost: 'bg-transparent text-ink-700 hover:bg-black/5 active:scale-[0.98]',
  danger: 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/15 active:scale-[0.98]',
}

const sizes = {
  md: 'h-11 px-4 text-sm',
  lg: 'h-13 px-5 text-base',
}

export function Button({ variant = 'primary', size = 'md', loading, icon, className, children, disabled, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex w-full items-center justify-center gap-2 rounded-2xl font-semibold transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? <Spinner /> : icon}
      {children}
    </button>
  )
}

export function Spinner({ className }: { className?: string }) {
  return (
    <svg className={cn('h-4 w-4 animate-spin', className)} viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  )
}
