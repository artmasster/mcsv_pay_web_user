import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../api/client'

type PayRow = {
  id: string
  application_id: string
  amount: string
  amount_with_decimal: string
  status: string
  client_reference: string | null
  created_at: string | null
}

function payBadge(status: string) {
  if (status === 'completed') return <span className="badge badge-success">completed</span>
  if (status === 'pending') return <span className="badge badge-warn">pending</span>
  if (status === 'cancelled') return <span className="badge badge-muted">cancelled</span>
  return <span className="badge badge-muted">{status}</span>
}

export function PaymentsPage() {
  const [items, setItems] = useState<PayRow[]>([])
  const [total, setTotal] = useState(0)
  const [err, setErr] = useState('')

  useEffect(() => {
    api
      .get<{ items: PayRow[]; total: number }>('/api/merchant/payments/')
      .then(({ data }) => {
        setItems(data.items)
        setTotal(data.total)
      })
      .catch(() => setErr('โหลดไม่ได้'))
  }, [])

  return (
    <div>
      <h1 className="page-title">ธุรกรรม</h1>
      <p className="page-desc">
        ทั้งหมด <strong>{total}</strong> รายการ · แสดงล่าสุดสูงสุด 50 รายการ
      </p>
      {err ? <div className="err">{err}</div> : null}
      <div className="card">
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>สถานะ</th>
                <th>ยอดโอน</th>
                <th>อ้างอิง</th>
                <th>เวลา</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>{payBadge(p.status)}</td>
                  <td style={{ fontWeight: 600 }}>฿{p.amount_with_decimal}</td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                    {p.client_reference || '—'}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '0.8125rem' }}>{p.created_at || '—'}</td>
                  <td>
                    <Link
                      to={`/dashboard/payments/${p.id}`}
                      className="btn btn-secondary btn-sm"
                      style={{ textDecoration: 'none' }}
                    >
                      รายละเอียด
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {items.length === 0 && !err ? (
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0 0' }}>ยังไม่มีธุรกรรม</p>
        ) : null}
      </div>
    </div>
  )
}
