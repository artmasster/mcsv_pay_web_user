import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import QRCode from 'react-qr-code'
import { api } from '../api/client'

type Detail = {
  id: string
  status: string
  amount: string
  amount_with_decimal: string
  client_reference: string | null
  promptpay_qr: string
  truewallet_phone: string
  truewallet_full_name: string
  expired_at: string | null
}

export function PaymentDetailPage() {
  const { paymentId } = useParams<{ paymentId: string }>()
  const [d, setD] = useState<Detail | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    if (!paymentId) return
    api
      .get<Detail>(`/api/merchant/payments/${paymentId}`)
      .then(({ data }) => setD(data))
      .catch(() => setErr('โหลดไม่ได้'))
  }, [paymentId])

  if (err) return <div className="err">{err}</div>
  if (!d)
    return (
      <p style={{ color: 'var(--text-muted)' }}>กำลังโหลด…</p>
    )

  return (
    <div>
      <Link to="/dashboard/payments" className="back-link" style={{ textDecoration: 'none' }}>
        ← กลับไปรายการธุรกรรม
      </Link>
      <h1 className="page-title">รายการชำระเงิน</h1>
      <p className="page-desc">
        รหัสอ้างอิง <code className="inline">{d.id}</code>
      </p>

      <div className="card" style={{ maxWidth: 520 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              สถานะ
            </div>
            <div style={{ marginTop: '0.25rem', fontWeight: 700, fontSize: '1.125rem' }}>{d.status}</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              ยอดโอน
            </div>
            <div style={{ marginTop: '0.25rem', fontWeight: 700, fontSize: '1.125rem' }}>฿{d.amount_with_decimal}</div>
          </div>
        </div>

        <dl style={{ margin: 0, display: 'grid', gap: '0.65rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <dt style={{ color: 'var(--text-muted)', margin: 0 }}>ยอดหลัก</dt>
            <dd style={{ margin: 0, fontWeight: 500 }}>฿{d.amount}</dd>
          </div>
          {d.client_reference ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <dt style={{ color: 'var(--text-muted)', margin: 0 }}>อ้างอิงฝั่งคุณ</dt>
              <dd style={{ margin: 0 }}>{d.client_reference}</dd>
            </div>
          ) : null}
          {d.expired_at ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <dt style={{ color: 'var(--text-muted)', margin: 0 }}>หมดอายุ</dt>
              <dd style={{ margin: 0 }}>{d.expired_at}</dd>
            </div>
          ) : null}
          {d.truewallet_full_name ? (
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
              <dt style={{ color: 'var(--text-muted)', margin: 0 }}>ชื่อบัญชีรับเงิน</dt>
              <dd style={{ margin: 0 }}>{d.truewallet_full_name}</dd>
            </div>
          ) : null}
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem' }}>
            <dt style={{ color: 'var(--text-muted)', margin: 0 }}>เบอร์ TrueWallet</dt>
            <dd style={{ margin: 0, fontFamily: 'ui-monospace, monospace' }}>{d.truewallet_phone}</dd>
          </div>
        </dl>

        {d.status === 'pending' ? (
          <div style={{ marginTop: '1.75rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
            <p style={{ margin: '0 0 0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              สแกนจ่ายด้วย PromptPay / TrueMoney
            </p>
            <div
              style={{
                display: 'inline-block',
                padding: '1rem',
                background: '#fff',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                boxShadow: 'var(--shadow)',
              }}
            >
              <QRCode value={d.promptpay_qr} size={216} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
