import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

const variantClasses = {
  primary:
    'bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-500 disabled:bg-blue-400',
  secondary:
    'border border-slate-300 bg-white text-slate-800 shadow-sm hover:bg-slate-50 focus-visible:ring-slate-400',
  ghost: 'text-slate-700 hover:bg-slate-100 focus-visible:ring-slate-400',
  danger:
    'bg-red-600 text-white shadow-sm hover:bg-red-700 focus-visible:ring-red-500 disabled:bg-red-400',
  brand:
    'bg-orange-600 text-white shadow-sm hover:bg-orange-700 focus-visible:ring-orange-500 disabled:bg-orange-400',
} as const

const sizeClasses = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
} as const

const baseClass =
  'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors no-underline ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ' +
  'disabled:pointer-events-none disabled:opacity-60'

export type ButtonVariant = keyof typeof variantClasses
export type ButtonSize = keyof typeof sizeClasses

export function buttonClassName({
  variant = 'primary',
  size = 'md',
  className,
}: {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}) {
  return cn(
    baseClass,
    variantClasses[variant],
    sizeClasses[size],
    className,
  )
}

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  size?: ButtonSize
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={buttonClassName({ variant, size, className })}
      {...props}
    />
  )
}
