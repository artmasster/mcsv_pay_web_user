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
      <h1 style={{ marginTop: 0 }}>ธุรกรรม</h1>
      <p style={{ color: '#94a3b8' }}>ทั้งหมด {total} รายการ (แสดงล่าสุด)</p>
      {err ? <div className="err">{err}</div> : null}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>สถานะ</th>
              <th>ยอด</th>
              <th>อ้างอิง</th>
              <th>เวลา</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id}>
                <td>{p.status}</td>
                <td>{p.amount_with_decimal}</td>
                <td>{p.client_reference || '—'}</td>
                <td>{p.created_at || '—'}</td>
                <td>
                  <Link to={`/payments/${p.id}`}>ดู</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
