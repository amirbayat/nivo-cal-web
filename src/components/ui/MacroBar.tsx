interface MacroBarProps {
  label: string
  value: number
  target: number
  unit: string
  color: string
}

export function MacroBar({ label, value, target, unit, color }: MacroBarProps) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between text-xs">
        <span className="font-medium text-ink-700">{label}</span>
        <span className="text-ink-500">
          {Math.round(value)}/{Math.round(target)} {unit}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-black/5">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  )
}
