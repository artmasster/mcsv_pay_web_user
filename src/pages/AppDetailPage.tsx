import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { api } from '../api/client'

type KeyRow = {
  id: string
  key_prefix: string
  name: string | null
  created_at: string | null
  revoked_at: string | null
}

export function AppDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [webhookUrl, setWebhookUrl] = useState('')
  const [keys, setKeys] = useState<KeyRow[]>([])
  const [newKey, setNewKey] = useState<string | null>(null)
  const [keyName, setKeyName] = useState('')
  const [err, setErr] = useState('')
  const [whSecret, setWhSecret] = useState<string | null>(null)

  async function loadKeys() {
    if (!id) return
    const { data } = await api.get<{ items: KeyRow[] }>(`/api/merchant/applications/${id}/api-keys`)
    setKeys(data.items)
  }

  useEffect(() => {
    if (!id) return
    api
      .get<{ items: { id: string; webhook_url: string | null }[] }>('/api/merchant/applications/')
      .then(({ data }) => {
        const app = data.items.find((x) => x.id === id)
        if (app?.webhook_url) setWebhookUrl(app.webhook_url)
      })
      .catch(() => {})
    loadKeys().catch(() => setErr('โหลดคีย์ไม่ได้'))
  }, [id])

  async function saveWebhook() {
    if (!id) return
    setErr('')
    try {
      await api.patch(`/api/merchant/applications/${id}`, { webhook_url: webhookUrl || null })
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'บันทึกไม่สำเร็จ')
    }
  }

  async function createKey() {
    if (!id) return
    setErr('')
    setNewKey(null)
    try {
      const { data } = await api.post(`/api/merchant/applications/${id}/api-keys`, {
        name: keyName || null,
      })
      setNewKey(data.api_key as string)
      setKeyName('')
      await loadKeys()
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'สร้างคีย์ไม่สำเร็จ')
    }
  }

  async function rotateWh() {
    if (!id) return
    setErr('')
    try {
      const { data } = await api.post(`/api/merchant/applications/${id}/rotate-webhook-secret`)
      setWhSecret(data.webhook_secret as string)
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'หมุน secret ไม่สำเร็จ')
    }
  }

  async function revokeKey(keyId: string) {
    if (!confirm('ยกเลิกคีย์นี้? ระบบที่ใช้คีย์นี้จะเรียก API ไม่ได้')) return
    setErr('')
    try {
      await api.delete(`/api/merchant/api-keys/${keyId}`)
      await loadKeys()
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'ยกเลิกไม่สำเร็จ')
    }
  }

  return (
    <div>
      <Link to="/dashboard" className="back-link" style={{ textDecoration: 'none' }}>
        ← กลับไปแอปทั้งหมด
      </Link>
      <h1 className="page-title">จัดการแอป</h1>
      <p className="page-desc">
        รหัสแอป <code className="inline">{id?.slice(0, 8)}…</code>
      </p>

      <div className="card" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem', fontWeight: 600 }}>Webhook URL</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1rem', lineHeight: 1.55 }}>
          ระบบจะส่ง <code className="inline">POST</code> JSON พร้อมหัว <code className="inline">X-PGW-Signature</code>{' '}
          (HMAC-SHA256 ของ <code className="inline">timestamp.body</code>)
        </p>
        <input
          className="input"
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://api.example.com/webhooks/pgw"
          style={{ marginBottom: '0.75rem' }}
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          <button type="button" className="btn btn-primary" onClick={saveWebhook}>
            บันทึก URL
          </button>
          <button type="button" className="btn btn-secondary" onClick={rotateWh}>
            หมุน webhook secret
          </button>
        </div>
        {whSecret ? (
          <div className="secret-box" style={{ marginTop: '0.75rem' }}>
            <strong style={{ color: 'var(--text)' }}>webhook_secret ใหม่:</strong> {whSecret}
          </div>
        ) : null}
      </div>

      <div className="card">
        <h2 style={{ margin: '0 0 0.75rem', fontSize: '1.05rem', fontWeight: 600 }}>API keys</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', margin: '0 0 1rem' }}>
          ใช้ใน header <code className="inline">Authorization: Bearer pgw_sk_…</code> — แสดงค่าเต็มครั้งเดียวตอนสร้าง
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
          <input
            className="input"
            style={{ flex: '1 1 200px', margin: 0 }}
            placeholder="ชื่อคีย์ (ไม่บังคับ)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
          />
          <button type="button" className="btn btn-primary" onClick={createKey}>
            สร้างคีย์ใหม่
          </button>
        </div>
        {newKey ? (
          <div className="success-banner" style={{ marginBottom: '1rem' }}>
            <strong>คัดลอกเก็บไว้ทันที</strong> — จะไม่แสดงอีก: <span style={{ wordBreak: 'break-all' }}>{newKey}</span>
          </div>
        ) : null}
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>Prefix</th>
                <th>ชื่อ</th>
                <th>สร้างเมื่อ</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {keys.map((k) => (
                <tr key={k.id}>
                  <td>
                    <code className="inline">{k.key_prefix}…</code>
                  </td>
                  <td>{k.name || '—'}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{k.created_at || '—'}</td>
                  <td>
                    {!k.revoked_at ? (
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => revokeKey(k.id)}>
                        ยกเลิก
                      </button>
                    ) : (
                      <span className="badge badge-muted">ยกเลิกแล้ว</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {err ? <div className="err" style={{ marginTop: '1rem' }}>{err}</div> : null}

      <p style={{ marginTop: '1.5rem' }}>
        <Link to="/dashboard/payments">ดูธุรกรรมทั้งหมด →</Link>
      </p>
    </div>
  )
}
