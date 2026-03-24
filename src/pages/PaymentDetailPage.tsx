import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { QRCode } from '@/lib/reactQrCode'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { api } from '@/api/client'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { Code } from '@/components/ui/code'

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
  fee_user_per_transaction: string
}

function statusBadge(status: string) {
  if (status === 'completed')
    return <Badge variant="success">completed</Badge>
  if (status === 'pending')
    return <Badge variant="warning">pending</Badge>
  if (status === 'cancelled')
    return <Badge>cancelled</Badge>
  return <Badge>{status}</Badge>
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

  if (err) return <Alert variant="error">{err}</Alert>
  if (!d)
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-blue-500" />
      </div>
    )

  return (
    <div className="space-y-6">
      <Link
        to="/dashboard/payments"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 no-underline hover:text-blue-700"
      >
        <ArrowLeft className="size-3.5" />
        กลับไปรายการธุรกรรม
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">รายการชำระเงิน</h1>
        <p className="mt-1 text-sm text-slate-600">
          รหัสอ้างอิง <Code>{d.id}</Code>
        </p>
      </div>

      <Card className="max-w-lg">
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              สถานะ
            </div>
            <div className="mt-1.5">{statusBadge(d.status)}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              ยอดโอน
            </div>
            <div className="mt-1 text-2xl font-bold tabular-nums text-slate-900">฿{d.amount_with_decimal}</div>
          </div>
        </div>

        <dl className="mt-6 divide-y divide-slate-100 text-sm">
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-slate-500">ยอดหลัก</dt>
            <dd className="font-medium tabular-nums">฿{d.amount}</dd>
          </div>
          {d.fee_user_per_transaction ? (
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-slate-500">ค่าธรรมเนียม platform</dt>
              <dd className="font-medium tabular-nums">฿{d.fee_user_per_transaction} / รายการ</dd>
            </div>
          ) : null}
          {d.client_reference ? (
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-slate-500">อ้างอิงฝั่งคุณ</dt>
              <dd className="font-mono text-xs">{d.client_reference}</dd>
            </div>
          ) : null}
          {d.expired_at ? (
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-slate-500">หมดอายุ</dt>
              <dd>{d.expired_at}</dd>
            </div>
          ) : null}
          {d.truewallet_full_name ? (
            <div className="flex justify-between gap-4 py-3">
              <dt className="text-slate-500">ชื่อบัญชีรับเงิน</dt>
              <dd>{d.truewallet_full_name}</dd>
            </div>
          ) : null}
          <div className="flex justify-between gap-4 py-3">
            <dt className="text-slate-500">เบอร์ TrueWallet</dt>
            <dd className="font-mono text-sm">{d.truewallet_phone}</dd>
          </div>
        </dl>

        {d.status === 'pending' ? (
          <div className="mt-6 border-t border-slate-200 pt-6">
            <p className="font-semibold text-slate-800">
              สแกนจ่ายด้วย PromptPay / TrueMoney
            </p>
            <div className="mt-4 inline-block rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <QRCode value={d.promptpay_qr} size={216} />
            </div>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
