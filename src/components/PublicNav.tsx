import { Link } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { cn } from '@/lib/cn'
import { LinkButton } from '@/components/ui/link-button'

function navLinkClass() {
  return cn(
    'text-sm font-medium text-slate-500 no-underline transition-colors hover:text-slate-900',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 rounded-md px-2 py-1',
  )
}

export function PublicNav() {
  const logged =
    typeof localStorage !== 'undefined' &&
    !!localStorage.getItem('pgw_merchant_token')

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          to="/"
          className="flex items-center gap-2.5 no-underline"
        >
          <div className="flex size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
            <Wallet className="size-[18px]" />
          </div>
          <span className="text-base font-bold tracking-tight text-slate-900">
            MCSV<span className="text-blue-600"> Pay</span>
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 sm:gap-2">
          <Link to="/" className={navLinkClass()}>
            หน้าแรก
          </Link>
          {logged ? (
            <>
              <Link to="/dashboard" className={navLinkClass()}>
                แดชบอร์ด
              </Link>
              <Link to="/dashboard/payments" className={navLinkClass()}>
                ธุรกรรม
              </Link>
            </>
          ) : null}
          {logged ? null : (
            <>
              <Link to="/login" className={navLinkClass()}>
                เข้าสู่ระบบ
              </Link>
              <LinkButton to="/register" variant="primary" size="sm">
                สมัครใช้งาน
              </LinkButton>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
