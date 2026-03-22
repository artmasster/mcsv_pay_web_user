import { useEffect, useState } from 'react'
import { Boxes, Plus } from 'lucide-react'
import { api } from '@/api/client'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Code } from '@/components/ui/code'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { LinkButton } from '@/components/ui/link-button'
import { PageHeader } from '@/components/ui/page-header'
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table'

type AppRow = {
  id: string
  name: string
  slug: string
  status: string
}

function statusBadge(status: string) {
  if (status === 'active')
    return <Badge variant="success">active</Badge>
  if (status === 'suspended')
    return <Badge variant="danger">suspended</Badge>
  return <Badge>{status}</Badge>
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
    <div className="space-y-8">
      <PageHeader
        title="แอปพลิเคชัน"
        description={
          <>
            แยกคีย์และ webhook ต่อระบบ — เรียก API สร้างรายการชำระด้วย{' '}
            <Code>POST /v1/payments</Code>
          </>
        }
      />

      <Card>
        <CardTitle className="flex items-center gap-2">
          <Plus className="size-4 text-blue-600" />
          สร้างแอปใหม่
        </CardTitle>
        <form className="mt-4" onSubmit={create}>
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
            <FormField id="app-name" label="ชื่อแอป" className="min-w-0 flex-1 sm:min-w-[180px]">
              <Input
                id="app-name"
                placeholder="เช่น ร้านค้าหลัก"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
            <FormField id="app-slug" label="Slug" className="min-w-0 flex-1 sm:min-w-[160px]">
              <Input
                id="app-slug"
                placeholder="a-z 0-9 และ -"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </FormField>
            <Button type="submit" className="w-full gap-2 sm:w-auto">
              <Plus className="size-4" />
              สร้างแอป
            </Button>
          </div>
          {err ? (
            <Alert variant="error" className="mt-4">
              {err}
            </Alert>
          ) : null}
          {secretInfo ? (
            <Alert variant="success" className="mt-4">
              {secretInfo}
            </Alert>
          ) : null}
        </form>
      </Card>

      <Card>
        <CardTitle>รายการแอป</CardTitle>
        {items.length > 0 ? (
          <TableWrap className="mt-4">
            <Table>
              <Thead>
                <Tr>
                  <Th>ชื่อ</Th>
                  <Th>Slug</Th>
                  <Th>สถานะ</Th>
                  <Th className="w-28 text-right sm:text-left" />
                </Tr>
              </Thead>
              <Tbody>
                {items.map((a) => (
                  <Tr key={a.id}>
                    <Td className="font-semibold">{a.name}</Td>
                    <Td>
                      <Code>{a.slug}</Code>
                    </Td>
                    <Td>{statusBadge(a.status)}</Td>
                    <Td className="text-right sm:text-left">
                      <LinkButton to={`/dashboard/apps/${a.id}`} variant="secondary" size="sm">
                        จัดการ
                      </LinkButton>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableWrap>
        ) : (
          <div className="mt-6 flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
              <Boxes className="size-6" />
            </div>
            <p className="text-sm text-slate-500">ยังไม่มีแอป — สร้างแอปแรกด้านบน</p>
          </div>
        )}
      </Card>
    </div>
  )
}
