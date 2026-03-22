import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

type AppRow = {
  id: string
  name: string
  slug: string
  status: string
}

function statusBadge(status: string) {
  if (status === 'active') return <span className="badge badge-success">active</span>
  if (status === 'suspended') return <span className="badge badge-danger">suspended</span>
  return <span className="badge badge-muted">{status}</span>
}

export function DashboardPage() {
  const [items, setItems] = useState<AppRow[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [err, setErr] = useState('')
  const [secretInfo, setSecretInfo] = useState<string | null>(null)

  async function load() {
    const { data } = await api.get<{ items: AppRow[] }>('/api/merchant/applications/')
    setItems(data.items)
  }

  useEffect(() => {
    load().catch(() => setErr('โหลดแอปไม่ได้'))
  }, [])

  async function create(e: React.FormEvent) {
    e.preventDefault()
    setErr('')
    setSecretInfo(null)
    try {
      const { data } = await api.post<{ webhook_secret?: string }>('/api/merchant/applications/', {
        name,
        slug,
      })
      const wh = data.webhook_secret
      setSecretInfo(
        wh
          ? `สร้างแอปสำเร็จ — เก็บ webhook_secret นี้ไว้ตรวจลายเซ็นจากเซิร์ฟเวอร์ของคุณ: ${wh}`
          : 'สร้างแอปสำเร็จ',
      )
      setName('')
      setSlug('')
      await load()
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'สร้างไม่สำเร็จ')
    }
  }

  return (
    <div>
      <h1 className="page-title">แอปพลิเคชัน</h1>
      <p className="page-desc">
        แยกคีย์และ webhook ต่อระบบ — เรียก API สร้างรายการชำระด้วย <code className="inline">POST /v1/payments</code>
      </p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 600 }}>สร้างแอปใหม่</h2>
        <form onSubmit={create}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'flex-end' }}>
            <div style={{ flex: '1 1 180px' }}>
              <label className="input-label" htmlFor="app-name">
                ชื่อแอป
              </label>
              <input
                id="app-name"
                className="input"
                placeholder="เช่น ร้านค้าหลัก"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div style={{ flex: '1 1 160px' }}>
              <label className="input-label" htmlFor="app-slug">
                Slug
              </label>
              <input
                id="app-slug"
                className="input"
                placeholder="a-z 0-9 และ -"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              สร้างแอป
            </button>
          </div>
          {err ? <div className="err">{err}</div> : null}
          {secretInfo ? <div className="secret-box">{secretInfo}</div> : null}
        </form>
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 1rem', fontSize: '1.05rem', fontWeight: 600 }}>รายการแอป</h2>
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ชื่อ</th>
                <th>Slug</th>
                <th>สถานะ</th>
                <th style={{ width: 100 }}></th>
              </tr>
            </thead>
            <tbody>
              {items.map((a) => (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td>
                    <code className="inline">{a.slug}</code>
                  </td>
                  <td>{statusBadge(a.status)}</td>
                  <td>
                    <Link to={`/dashboard/apps/${a.id}`} className="btn btn-secondary btn-sm" style={{ textDecoration: 'none' }}>
                      จัดการ
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 0', fontSize: '0.9rem' }}>
            ยังไม่มีแอป — สร้างแอปแรกด้านบน
          </p>
        ) : null}
      </div>
    </div>
  )
}
