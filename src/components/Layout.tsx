import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { LayoutGrid, LogOut, Receipt, Shield } from 'lucide-react'
import { PayLogoMark } from '@/components/PayLogoMark'
import { cn } from '@/lib/cn'
import { Button } from '@/components/ui/button'

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium no-underline transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2',
    isActive
      ? 'bg-blue-50 text-blue-700'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
  )
}

export function Layout() {
  const nav = useNavigate()
  function logout() {
    localStorage.removeItem('pay_merchant_token')
    nav('/login')
  }

  return (
    <div className="flex min-h-dvh flex-col bg-slate-50">
      <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
          <Link
            to="/dashboard"
            className="flex items-center gap-2.5 no-underline"
          >
            <PayLogoMark className="size-8" />
            <span className="text-base font-bold tracking-tight text-slate-900">
              MCSV{' '}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-600 bg-clip-text text-transparent">
                Pay
              </span>
            </span>
          </Link>

          <nav className="flex flex-1 items-center gap-1">
            <NavLink to="/dashboard" end className={navClass}>
              <LayoutGrid className="size-4" />
              แอปพลิเคชัน
            </NavLink>
            <NavLink to="/dashboard/payments" className={navClass}>
              <Receipt className="size-4" />
              ธุรกรรม
            </NavLink>
            <NavLink to="/dashboard/security" className={navClass}>
              <Shield className="size-4" />
              ความปลอดภัย
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={logout}
              className="gap-2 text-slate-500 hover:text-red-600"
            >
              <LogOut className="size-3.5" />
              ออก
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  )
}
