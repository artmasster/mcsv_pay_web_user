import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'

export function Layout() {
  const nav = useNavigate()
  function logout() {
    localStorage.removeItem('pgw_merchant_token')
    nav('/login')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          borderBottom: '1px solid #252b38',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
        }}
      >
        <Link to="/" style={{ fontWeight: 800, color: '#f8fafc', textDecoration: 'none' }}>
          MCSV PGW
        </Link>
        <nav style={{ display: 'flex', gap: '1rem', flex: 1 }}>
          <NavLink
            to="/"
            end
            style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#94a3b8' })}
          >
            แอป
          </NavLink>
          <NavLink
            to="/payments"
            style={({ isActive }) => ({ color: isActive ? '#38bdf8' : '#94a3b8' })}
          >
            ธุรกรรม
          </NavLink>
        </nav>
        <button type="button" className="btn btn-ghost" onClick={logout}>
          ออก
        </button>
      </header>
      <main style={{ padding: '1.25rem', maxWidth: 960, width: '100%', margin: '0 auto' }}>
        <Outlet />
      </main>
    </div>
  )
}
