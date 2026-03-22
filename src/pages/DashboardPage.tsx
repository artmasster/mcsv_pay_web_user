import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

type AppRow = {
  id: string
  name: string
  slug: string
  status: string
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
          ? `สร้างแอปแล้ว เก็บ webhook_secret สำหรับตรวจลายเซ็น: ${wh}`
          : 'สร้างแอปแล้ว',
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
      <h1 style={{ marginTop: 0 }}>แอปพลิเคชัน</h1>
      <p style={{ color: '#94a3b8' }}>
        แต่ละแอปมี API key แยก ใช้เรียกสร้างรายการชำระผ่าน Merchant API
      </p>

      <form className="card" onSubmit={create} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginTop: 0 }}>สร้างแอปใหม่</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          <input
            placeholder="ชื่อ"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={{ flex: 1, minWidth: 140, padding: 8, borderRadius: 6 }}
          />
          <input
            placeholder="slug (a-z0-9-)"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            style={{ flex: 1, minWidth: 140, padding: 8, borderRadius: 6 }}
          />
          <button type="submit" className="btn btn-primary">
            สร้าง
          </button>
        </div>
        {err ? <div className="err">{err}</div> : null}
        {secretInfo ? (
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              background: '#0f172a',
              borderRadius: 8,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}
          >
            {secretInfo}
          </pre>
        ) : null}
      </form>

      <div className="card">
        <table>
          <thead>
            <tr>
              <th>ชื่อ</th>
              <th>slug</th>
              <th>สถานะ</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>
                  <code>{a.slug}</code>
                </td>
                <td>{a.status}</td>
                <td>
                  <Link to={`/apps/${a.id}`}>จัดการ</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 ? <p style={{ color: '#64748b' }}>ยังไม่มีแอป</p> : null}
      </div>
    </div>
  )
}
