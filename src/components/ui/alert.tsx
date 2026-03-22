import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const variants = {
  error: 'border-red-200 bg-red-50 text-red-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  info: 'border-blue-200 bg-blue-50 text-blue-800',
} as const

export type AlertVariant = keyof typeof variants

export type AlertProps = HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant
}

export function Alert({
  className,
  variant = 'info',
  role = 'alert',
  ...props
}: AlertProps) {
  return (
    <div
      role={role}
      className={cn(
        'rounded-lg border px-4 py-3 text-sm',
        variants[variant],
        className,
      )}
      {...props}
    />
  )
}
