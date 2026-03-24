import { useEffect, useState } from 'react'
import { Receipt } from 'lucide-react'
import { api } from '@/api/client'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { LinkButton } from '@/components/ui/link-button'
import { PageHeader } from '@/components/ui/page-header'
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table'

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
  if (status === 'completed')
    return <Badge variant="success">completed</Badge>
  if (status === 'pending')
    return <Badge variant="warning">pending</Badge>
  if (status === 'cancelled')
    return <Badge>cancelled</Badge>
  return <Badge>{status}</Badge>
}

export function PaymentsPage() {
  const [items, setItems] = useState<PayRow[]>([])
  const [total, setTotal] = useState(0)
  const [feeUserPerTxn, setFeeUserPerTxn] = useState<string | null>(null)
  const [err, setErr] = useState('')

  useEffect(() => {
    api
      .get<{ items: PayRow[]; total: number; fee_user_per_transaction?: string }>(
        '/api/merchant/payments',
      )
      .then(({ data }) => {
        setItems(data.items)
        setTotal(data.total)
        if (data.fee_user_per_transaction) setFeeUserPerTxn(data.fee_user_per_transaction)
      })
      .catch(() => setErr('โหลดไม่ได้'))
  }, [])

  return (
    <div className="space-y-6">
      <PageHeader
        title="ธุรกรรม"
        description={
          <>
            ทั้งหมด <strong>{total}</strong> รายการ · แสดงล่าสุดสูงสุด 50 รายการ
            {feeUserPerTxn ? (
              <span className="mt-2 block text-slate-600">
                ค่าธรรมเนียม platform ฿{feeUserPerTxn} ต่อรายการที่ชำระสำเร็จ
              </span>
            ) : null}
          </>
        }
      />
      {err ? <Alert variant="error">{err}</Alert> : null}
      <Card>
        {items.length > 0 ? (
          <TableWrap>
            <Table>
              <Thead>
                <Tr>
                  <Th>สถานะ</Th>
                  <Th>ยอดโอน</Th>
                  <Th>อ้างอิง</Th>
                  <Th>เวลา</Th>
                  <Th className="w-32" />
                </Tr>
              </Thead>
              <Tbody>
                {items.map((p) => (
                  <Tr key={p.id}>
                    <Td>{payBadge(p.status)}</Td>
                    <Td className="font-semibold tabular-nums">฿{p.amount_with_decimal}</Td>
                    <Td className="text-sm text-slate-500">
                      {p.client_reference || '—'}
                    </Td>
                    <Td className="whitespace-nowrap text-xs text-slate-500">{p.created_at || '—'}</Td>
                    <Td>
                      <LinkButton
                        to={`/dashboard/payments/${p.id}`}
                        variant="secondary"
                        size="sm"
                      >
                        รายละเอียด
                      </LinkButton>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        ) : !err ? (
          <div className="flex flex-col items-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Receipt className="size-6" />
            </div>
            <p className="text-sm text-slate-500">ยังไม่มีธุรกรรม</p>
          </div>
        ) : null}
      </Card>
    </div>
  )
}
