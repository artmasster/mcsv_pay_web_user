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
  if (!d) return <p>กำลังโหลด…</p>

  return (
    <div>
      <p>
        <Link to="/payments">← กลับ</Link>
      </p>
      <h1 style={{ marginTop: 0 }}>รายการ {d.id.slice(0, 8)}</h1>
      <div className="card">
        <p>
          สถานะ: <strong>{d.status}</strong>
        </p>
        <p>ยอดหลัก: {d.amount} บาท</p>
        <p>ยอดโอน (รวมทศนิยมอ้างอิง): {d.amount_with_decimal}</p>
        {d.client_reference ? <p>อ้างอิง: {d.client_reference}</p> : null}
        {d.expired_at ? <p>หมดอายุ: {d.expired_at}</p> : null}
        {d.truewallet_full_name ? <p>ชื่อบัญชี: {d.truewallet_full_name}</p> : null}
        <p>เบอร์ TrueWallet: {d.truewallet_phone}</p>
        {d.status === 'pending' ? (
          <div style={{ marginTop: 16 }}>
            <p style={{ color: '#94a3b8' }}>สแกน PromptPay / TrueMoney</p>
            <div style={{ background: '#fff', padding: 16, display: 'inline-block', borderRadius: 12 }}>
              <QRCode value={d.promptpay_qr} size={220} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
