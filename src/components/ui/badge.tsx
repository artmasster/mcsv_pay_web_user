import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  primary: 'bg-blue-50 text-blue-800 border-blue-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  warning: 'bg-amber-50 text-amber-900 border-amber-200',
  danger: 'bg-red-50 text-red-800 border-red-200',
} as const

export type BadgeVariant = keyof typeof variants

export type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
