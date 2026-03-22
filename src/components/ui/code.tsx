import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export type CodeProps = HTMLAttributes<HTMLElement>

export function Code({ className, ...props }: CodeProps) {
  return (
    <code
      className={cn(
        'rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[0.8125rem] text-slate-800',
        className,
      )}
      {...props}
    />
  )
}
