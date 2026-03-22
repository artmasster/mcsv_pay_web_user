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
      const m =
        typeof x === 'object' && x !== null && 'response' in x
          ? (x as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      setErr(m || 'บันทึกไม่สำเร็จ')
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
      const m =
        typeof x === 'object' && x !== null && 'response' in x
          ? (x as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      setErr(m || 'สร้างคีย์ไม่สำเร็จ')
    }
  }

  async function rotateWh() {
    if (!id) return
    setErr('')
    try {
      const { data } = await api.post(`/api/merchant/applications/${id}/rotate-webhook-secret`)
      setWhSecret(data.webhook_secret as string)
    } catch (x: unknown) {
      const m =
        typeof x === 'object' && x !== null && 'response' in x
          ? (x as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      setErr(m || 'หมุน secret ไม่สำเร็จ')
    }
  }

  async function revokeKey(keyId: string) {
    if (!confirm('ยกเลิกคีย์นี้?')) return
    setErr('')
    try {
      await api.delete(`/api/merchant/api-keys/${keyId}`)
      await loadKeys()
    } catch (x: unknown) {
      const m =
        typeof x === 'object' && x !== null && 'response' in x
          ? (x as { response?: { data?: { error?: string } } }).response?.data?.error
          : null
      setErr(m || 'ยกเลิกไม่สำเร็จ')
    }
  }

  return (
    <div>
      <p>
        <Link to="/">← กลับ</Link>
      </p>
      <h1 style={{ marginTop: 0 }}>แอป #{id?.slice(0, 8)}</h1>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Webhook URL</h3>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          PGW จะ POST JSON พร้อมหัว <code>X-PGW-Signature</code> (HMAC-SHA256 ของ timestamp.body)
        </p>
        <input
          value={webhookUrl}
          onChange={(e) => setWebhookUrl(e.target.value)}
          placeholder="https://your-backend.example/pgw-webhook"
          style={{ width: '100%', padding: 8, borderRadius: 6, marginBottom: 8 }}
        />
        <button type="button" className="btn btn-primary" onClick={saveWebhook}>
          บันทึก URL
        </button>
        <button type="button" className="btn btn-ghost" style={{ marginLeft: 8 }} onClick={rotateWh}>
          หมุน webhook secret
        </button>
        {whSecret && (
          <pre
            style={{
              marginTop: 12,
              padding: 12,
              background: '#0f172a',
              borderRadius: 8,
              wordBreak: 'break-all',
            }}
          >
            webhook_secret ใหม่: {whSecret}
          </pre>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>API keys</h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
          <input
            placeholder="ชื่อคีย์ (ไม่บังคับ)"
            value={keyName}
            onChange={(e) => setKeyName(e.target.value)}
            style={{ flex: 1, minWidth: 160, padding: 8, borderRadius: 6 }}
          />
          <button type="button" className="btn btn-primary" onClick={createKey}>
            สร้างคีย์
          </button>
        </div>
        {newKey && (
          <pre
            style={{
              padding: 12,
              background: '#14532d',
              borderRadius: 8,
              wordBreak: 'break-all',
            }}
          >
            API key (ครั้งเดียว): {newKey}
          </pre>
        )}
        <table>
          <thead>
            <tr>
              <th>prefix</th>
              <th>ชื่อ</th>
              <th>สร้าง</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {keys.map((k) => (
              <tr key={k.id}>
                <td>
                  <code>{k.key_prefix}…</code>
                </td>
                <td>{k.name || '—'}</td>
                <td>{k.created_at || '—'}</td>
                <td>
                  {!k.revoked_at ? (
                    <button type="button" className="btn btn-ghost" onClick={() => revokeKey(k.id)}>
                      ยกเลิก
                    </button>
                  ) : (
                    <span style={{ color: '#64748b' }}>ยกเลิกแล้ว</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {err && <div className="err">{err}</div>}
      <p>
        <Link to="/payments">ดูธุรกรรมทั้งหมด →</Link>
      </p>
    </div>
  )
}
