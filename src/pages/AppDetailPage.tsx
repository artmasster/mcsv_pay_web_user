import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, KeyRound, Plus, Receipt, RefreshCw, Webhook, X } from 'lucide-react'
import { api } from '@/api/client'
import { Alert } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardTitle } from '@/components/ui/card'
import { Code } from '@/components/ui/code'
import { Input } from '@/components/ui/input'
import {
  TabList,
  TabPanel,
  Tabs,
  TabTrigger,
} from '@/components/ui/tabs'
import { Table, TableWrap, Tbody, Td, Th, Thead, Tr } from '@/components/ui/table'

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
    <div className="space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 no-underline hover:text-blue-700"
      >
        <ArrowLeft className="size-3.5" />
        กลับไปแอปทั้งหมด
      </Link>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">จัดการแอป</h1>
        <p className="mt-1 text-sm text-slate-600">
          รหัสแอป <Code>{id?.slice(0, 8)}…</Code>
        </p>
      </div>

      {err ? <Alert variant="error">{err}</Alert> : null}

      <Tabs defaultValue="webhook">
        <TabList aria-label="ส่วนจัดการแอป">
          <TabTrigger value="webhook">
            <Webhook className="size-3.5" />
            Webhook
          </TabTrigger>
          <TabTrigger value="keys">
            <KeyRound className="size-3.5" />
            API keys
          </TabTrigger>
        </TabList>
        <TabPanel value="webhook">
          <Card>
            <CardTitle className="flex items-center gap-2">
              <Webhook className="size-4 text-blue-600" />
              Webhook URL
            </CardTitle>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              ระบบจะส่ง <Code>POST</Code> JSON พร้อมหัว <Code>X-PAY-Signature</Code>{' '}
              (HMAC-SHA256 ของ <Code>timestamp.body</Code>)
            </p>
            <Input
              className="mt-4"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://api.example.com/webhooks/mcsv-pay"
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" onClick={saveWebhook}>
                บันทึก URL
              </Button>
              <Button type="button" variant="secondary" onClick={rotateWh} className="gap-1.5">
                <RefreshCw className="size-3.5" />
                หมุน webhook secret
              </Button>
            </div>
            {whSecret ? (
              <Alert variant="success" className="mt-4">
                <span className="font-semibold text-emerald-900">webhook_secret ใหม่:</span>{' '}
                <span className="break-all font-mono text-xs">{whSecret}</span>
              </Alert>
            ) : null}
          </Card>
        </TabPanel>
        <TabPanel value="keys">
          <Card>
            <CardTitle className="flex items-center gap-2">
              <KeyRound className="size-4 text-blue-600" />
              API keys
            </CardTitle>
            <p className="mt-2 text-sm text-slate-600">
              ใช้ใน header <Code>Authorization: Bearer pay_sk_…</Code> — แสดงค่าเต็มครั้งเดียวตอนสร้าง
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Input
                className="min-w-0 flex-1 sm:max-w-xs"
                placeholder="ชื่อคีย์ (ไม่บังคับ)"
                value={keyName}
                onChange={(e) => setKeyName(e.target.value)}
              />
              <Button type="button" onClick={createKey} className="w-full gap-1.5 sm:w-auto">
                <Plus className="size-4" />
                สร้างคีย์ใหม่
              </Button>
            </div>
            {newKey ? (
              <Alert variant="success" className="mt-4">
                <strong>คัดลอกเก็บไว้ทันที</strong> — จะไม่แสดงอีก:{' '}
                <span className="break-all font-mono text-xs">{newKey}</span>
              </Alert>
            ) : null}
            {keys.length > 0 ? (
              <TableWrap className="mt-4">
                <Table>
                  <Thead>
                    <Tr>
                      <Th>Prefix</Th>
                      <Th>ชื่อ</Th>
                      <Th>สร้างเมื่อ</Th>
                      <Th />
                    </Tr>
                  </Thead>
                  <Tbody>
                    {keys.map((k) => (
                      <Tr key={k.id}>
                        <Td>
                          <Code>{k.key_prefix}…</Code>
                        </Td>
                        <Td>{k.name || '—'}</Td>
                        <Td className="text-sm text-slate-500">{k.created_at || '—'}</Td>
                        <Td>
                          {!k.revoked_at ? (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => revokeKey(k.id)}
                              className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="size-3.5" />
                              ยกเลิก
                            </Button>
                          ) : (
                            <Badge>ยกเลิกแล้ว</Badge>
                          )}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableWrap>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
                <div className="flex size-10 items-center justify-center rounded-xl bg-slate-100 text-slate-400">
                  <KeyRound className="size-5" />
                </div>
                <p className="text-sm text-slate-500">ยังไม่มี API key — สร้างคีย์แรกด้านบน</p>
              </div>
            )}
          </Card>
        </TabPanel>
      </Tabs>

      <p className="text-sm">
        <Link
          to="/dashboard/payments"
          className="inline-flex items-center gap-1.5 font-medium text-blue-600 no-underline hover:text-blue-700"
        >
          <Receipt className="size-3.5" />
          ดูธุรกรรมทั้งหมด
        </Link>
      </p>
    </div>
  )
}
