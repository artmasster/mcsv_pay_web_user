import { useEffect, useState } from 'react'
import { Shield, ShieldCheck } from 'lucide-react'
import QRCode from 'react-qr-code'
import { api } from '@/api/client'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { FormField } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { PageHeader } from '@/components/ui/page-header'

export function SecurityPage() {
  const [tfaEnabled, setTfaEnabled] = useState(false)
  const [tfaLoading, setTfaLoading] = useState(true)
  const [tfaErr, setTfaErr] = useState('')
  const [tfaOk, setTfaOk] = useState('')
  const [tfaOtpauthUrl, setTfaOtpauthUrl] = useState<string | null>(null)
  const [tfaEnableCode, setTfaEnableCode] = useState('')
  const [tfaDisablePw, setTfaDisablePw] = useState('')
  const [tfaDisableCode, setTfaDisableCode] = useState('')
  const [emailVerified, setEmailVerified] = useState(true)

  useEffect(() => {
    setTfaLoading(true)
    api
      .get<{ enabled: boolean }>('/api/merchant/auth/2fa/status')
      .then(({ data }) => setTfaEnabled(data.enabled))
      .catch(() => {})
      .finally(() => setTfaLoading(false))
    api
      .get<{ email_verified?: boolean }>('/api/merchant/auth/me')
      .then(({ data }) => setEmailVerified(!!data.email_verified))
      .catch(() => {})
  }, [])

  return (
    <div className="space-y-8">
      <PageHeader
        title="ความปลอดภัย"
        description="ตั้งค่า 2FA สำหรับบัญชี merchant — รูปแบบเดียวกับ MCSV (Authenticator)"
      />

      <Card className="max-w-lg">
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Shield className="size-5" />
          </div>
          <div>
            <CardTitle className="text-base">การยืนยันตัวตนสองขั้นตอน (2FA)</CardTitle>
            <CardDescription className="mt-1">
              เมื่อเปิดใช้งาน จะต้องกรอกรหัสจากแอป Authenticator ทุกครั้งหลังล็อกอิน
            </CardDescription>
          </div>
        </div>

        {!emailVerified ? (
          <Alert variant="error" className="mt-4">
            กรุณายืนยันอีเมลก่อนเปิดใช้งาน 2FA
          </Alert>
        ) : null}

        {tfaLoading ? (
          <p className="mt-4 text-sm text-slate-500">กำลังโหลด…</p>
        ) : tfaEnabled ? (
          <div className="mt-4 space-y-3">
            <p className="flex items-center gap-2 text-sm font-medium text-emerald-700">
              <ShieldCheck className="size-4" />
              เปิดใช้งาน 2FA แล้ว
            </p>
            {tfaOk ? <Alert variant="success">{tfaOk}</Alert> : null}
            {tfaErr ? <Alert variant="error">{tfaErr}</Alert> : null}
            <p className="text-sm text-slate-600">ปิด 2FA ต้องใช้รหัสผ่านและรหัส 6 หลัก</p>
            <FormField id="m-tfa-dp" label="รหัสผ่าน">
              <Input
                id="m-tfa-dp"
                type="password"
                autoComplete="current-password"
                value={tfaDisablePw}
                onChange={(e) => setTfaDisablePw(e.target.value)}
              />
            </FormField>
            <FormField id="m-tfa-dc" label="รหัส 2FA (6 หลัก)">
              <Input
                id="m-tfa-dc"
                inputMode="numeric"
                maxLength={6}
                value={tfaDisableCode}
                onChange={(e) => setTfaDisableCode(e.target.value.replace(/\D/g, ''))}
              />
            </FormField>
            <Button
              type="button"
              variant="secondary"
              onClick={async () => {
                setTfaErr('')
                setTfaOk('')
                try {
                  await api.post('/api/merchant/auth/2fa/disable', {
                    password: tfaDisablePw,
                    code: tfaDisableCode,
                  })
                  setTfaOk('ปิด 2FA สำเร็จ')
                  setTfaEnabled(false)
                  setTfaOtpauthUrl(null)
                  setTfaDisablePw('')
                  setTfaDisableCode('')
                } catch (x: unknown) {
                  const ax = x as { response?: { data?: { error?: string } } }
                  setTfaErr(ax.response?.data?.error || 'ปิด 2FA ไม่สำเร็จ')
                }
              }}
            >
              ปิด 2FA
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            {tfaOk ? <Alert variant="success">{tfaOk}</Alert> : null}
            {tfaErr ? <Alert variant="error">{tfaErr}</Alert> : null}
            {!tfaOtpauthUrl ? (
              <Button
                type="button"
                disabled={!emailVerified}
                onClick={async () => {
                  setTfaErr('')
                  setTfaOk('')
                  try {
                    const { data } = await api.post<{ otpauth_url: string }>(
                      '/api/merchant/auth/2fa/setup',
                    )
                    setTfaOtpauthUrl(data.otpauth_url)
                    setTfaEnableCode('')
                  } catch (x: unknown) {
                    const ax = x as { response?: { data?: { error?: string } } }
                    setTfaErr(ax.response?.data?.error || 'เริ่มตั้งค่าไม่สำเร็จ')
                  }
                }}
              >
                เปิดใช้งาน 2FA
              </Button>
            ) : (
              <>
                <p className="text-sm text-slate-600">
                  สแกน QR ด้วยแอป Authenticator แล้วกรอกรหัส 6 หลักเพื่อยืนยัน
                </p>
                <div className="inline-block rounded-lg border border-slate-200 bg-white p-3">
                  <QRCode value={tfaOtpauthUrl} size={180} />
                </div>
                <FormField id="m-tfa-ec" label="รหัสยืนยัน">
                  <Input
                    id="m-tfa-ec"
                    inputMode="numeric"
                    maxLength={6}
                    value={tfaEnableCode}
                    onChange={(e) => setTfaEnableCode(e.target.value.replace(/\D/g, ''))}
                  />
                </FormField>
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    disabled={tfaEnableCode.length !== 6}
                    onClick={async () => {
                      setTfaErr('')
                      setTfaOk('')
                      try {
                        await api.post('/api/merchant/auth/2fa/enable', {
                          code: tfaEnableCode,
                        })
                        setTfaOk('เปิดใช้งาน 2FA สำเร็จ')
                        setTfaEnabled(true)
                        setTfaOtpauthUrl(null)
                      } catch (x: unknown) {
                        const ax = x as { response?: { data?: { error?: string } } }
                        setTfaErr(ax.response?.data?.error || 'ยืนยันไม่สำเร็จ')
                      }
                    }}
                  >
                    ยืนยันเปิด 2FA
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => {
                      setTfaOtpauthUrl(null)
                      setTfaErr('')
                    }}
                  >
                    ยกเลิก
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
