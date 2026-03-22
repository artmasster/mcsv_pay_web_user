import type { InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'
import { cn } from '@/lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, type = 'text', ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        'h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm',
        'placeholder:text-slate-400',
        'focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20',
        'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60',
        'read-only:bg-slate-50',
        className,
      )}
      {...props}
    />
  )
})
