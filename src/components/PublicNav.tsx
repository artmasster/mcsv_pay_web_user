import { Link } from 'react-router-dom'

export function PublicNav() {
  const logged = typeof localStorage !== 'undefined' && !!localStorage.getItem('pgw_merchant_token')

  return (
    <header className="public-nav">
      <div className="public-nav-inner">
        <Link to="/" className="public-nav-brand">
          MCSV Pay Gateway
        </Link>
        <nav className="public-nav-links">
          <Link to="/">หน้าแรก</Link>
          {logged ? (
            <>
              <Link to="/dashboard">แดชบอร์ด</Link>
              <Link to="/dashboard/payments">ธุรกรรม</Link>
            </>
          ) : null}
          {logged ? null : (
            <>
              <Link to="/login">เข้าสู่ระบบ</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ textDecoration: 'none' }}>
                สมัครใช้งาน
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}
