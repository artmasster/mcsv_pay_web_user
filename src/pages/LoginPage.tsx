import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client'

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
      nav('/')
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ')
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '3rem auto', padding: '0 1rem' }}>
      <h1 style={{ marginBottom: '1.5rem' }}>เข้าสู่ระบบ</h1>
      <form className="card" onSubmit={submit}>
        <div style={{ marginBottom: '0.75rem' }}>
          <label>
            อีเมล
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: 8, borderRadius: 6 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>
            รหัสผ่าน
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ display: 'block', width: '100%', marginTop: 4, padding: 8, borderRadius: 6 }}
            />
          </label>
        </div>
        {err ? <div className="err">{err}</div> : null}
        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
          เข้าสู่ระบบ
        </button>
        <p style={{ marginTop: 16, color: '#94a3b8' }}>
          ยังไม่มีบัญชี? <Link to="/register">สมัคร</Link>
        </p>
      </form>
    </div>
  )
}
