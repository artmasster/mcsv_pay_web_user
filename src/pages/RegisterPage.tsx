import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'
import { PublicNav } from '../components/PublicNav'

export function RegisterPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [err, setErr] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    try {
      const { data } = await api.post('/api/merchant/auth/register', {
        email,
        password,
        display_name: displayName || undefined,
      })
      localStorage.setItem('pgw_merchant_token', data.token)
      nav('/dashboard')
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'สมัครไม่สำเร็จ')
    }
  }

  return (
    <>
      <PublicNav />
      <div className="page-auth">
        <div className="auth-card">
          <div className="card card-elevated">
            <h1 className="page-title" style={{ marginBottom: '0.25rem' }}>
              สร้างบัญชี merchant
            </h1>
            <p className="page-desc" style={{ marginBottom: '1.25rem' }}>
              ใช้งานฟรีสำหรับเริ่มต้น — สร้างแอปและ API key ได้ทันทีหลังสมัคร
            </p>
            <form onSubmit={submit}>
              <div style={{ marginBottom: '1rem' }}>
                <label className="input-label" htmlFor="reg-email">
                  อีเมล
                </label>
                <input
                  id="reg-email"
                  className="input"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="input-label" htmlFor="reg-name">
                  ชื่อที่แสดง <span style={{ fontWeight: 400, color: 'var(--text-muted)' }}>(ไม่บังคับ)</span>
                </label>
                <input
                  id="reg-name"
                  className="input"
                  type="text"
                  autoComplete="name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label className="input-label" htmlFor="reg-password">
                  รหัสผ่าน
                </label>
                <input
                  id="reg-password"
                  className="input"
                  type="password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.35rem 0 0' }}>
                  อย่างน้อย 8 ตัวอักษร
                </p>
              </div>
              {err ? <div className="err">{err}</div> : null}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                สมัครใช้งาน
              </button>
            </form>
            <p style={{ marginTop: '1.25rem', fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center' }}>
              มีบัญชีแล้ว? <Link to="/login">เข้าสู่ระบบ</Link>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
