import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { PublicNav } from '../components/PublicNav'

export function LoginPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.post('/api/merchant/auth/login', { email, password })
      localStorage.setItem('pgw_merchant_token', data.token)
      nav('/dashboard')
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ')
    }
  }

  return (
    <>
      <PublicNav />
      <div className="page-auth">
        <div className="auth-card">
          <div className="card card-elevated">
            <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>
              เข้าสู่ระบบ
            </h1>
            <p className="page-desc" style={{ marginBottom: '1.25rem' }}>
              จัดการแอป API keys และธุรกรรมของคุณ
            </p>
            <form onSubmit={submit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="input-label" htmlFor="login-email">
                  อีเมล
                </label>
                <input
                  id="login-email"
                  className="input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="input-label" htmlFor="login-password">
                  รหัสผ่าน
                </label>
                <input
                  id="login-password"
                  className="input"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {err ? <div className="err">{err}</div> : null}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                เข้าสู่ระบบ
              </button>
            </form>
            <p style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              ยังไม่มีบัญชี?{' '}
              <Link to="/register">สมัครใช้งาน</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
