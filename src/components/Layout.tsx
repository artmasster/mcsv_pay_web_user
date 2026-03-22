import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

export function Layout() {
  const nav = useNavigate()
  function logout() {
    localStorage.removeItem('pgw_merchant_token')
    nav('/login')
  }

  return (
    <div className="dash-shell">
      <header className="dash-header">
        <div className="dash-header-inner">
          <Link to="/dashboard" className="dash-brand">
            MCSV Pay Gateway
          </Link>
          <nav className="dash-nav">
            <NavLink to="/dashboard" end className={({ isActive }) => (isActive ? 'active' : '')}>
              แอปพลิเคชัน
            </NavLink>
            <NavLink
              to="/dashboard/payments"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              ธุรกรรม
            </NavLink>
          </nav>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Link to="/" className="btn btn-ghost btn-sm" style={{ textDecoration: 'none' }}>
              หน้าแรก
            </Link>
            <button type="button" className="btn btn-secondary btn-sm" onClick={logout}>
              ออกจากระบบ
            </button>
          </div>
        </div>
      </header>
      <main className="dash-main">
        <Outlet />
      </main>
    </div>
  )
}
