import { useId } from 'react'
import { cn } from '@/lib/cn'

type PayLogoMarkProps = {
  className?: string
  'aria-label'?: string
}

/** โลโก้กล่องมุมโค้ง + กระเป๋า (เทียบเท่า favicon) */
export function PayLogoMark({
  className,
  'aria-label': ariaLabel = 'MCSV Pay',
}: PayLogoMarkProps) {
  const gradId = `pay-logo-grad-${useId().replace(/:/g, '')}`
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={cn('shrink-0', className)}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <linearGradient
          id={gradId}
          x1="12"
          y1="6"
          x2="88"
          y2="94"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="#7EB6FF" />
          <stop offset="42%" stopColor="#3b82f6" />
          <stop offset="78%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#6d28d9" />
        </linearGradient>
      </defs>
      <rect width="100" height="100" rx="25" fill={`url(#${gradId})`} />
      <g
        fill="none"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        transform="translate(50 50) scale(2.45) translate(-12 -12)"
      >
        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1" />
        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4" />
      </g>
    </svg>
  )
}
