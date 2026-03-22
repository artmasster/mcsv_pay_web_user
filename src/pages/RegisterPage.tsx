import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Wallet } from 'lucide-react'
import { api } from '@/api/client'
import { RecaptchaField } from '@/components/RecaptchaField'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { FormField, FormInput } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'

export function RegisterPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [err, setErr] = useState('')
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const [captchaBust, setCaptchaBust] = useState(0)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!captchaToken) {
      setErr('กรุณายืนยันว่าคุณไม่ใช่บอท')
      return
    }
    setErr('')
    try {
      const { data } = await api.post('/api/merchant/auth/register', {
        email,
        password,
        display_name: displayName || undefined,
        recaptcha_token: captchaToken,
      })
      localStorage.setItem('pgw_merchant_token', data.token)
      nav('/dashboard')
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'สมัครไม่สำเร็จ')
      setCaptchaBust((n) => n + 1)
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-sm">
            <Wallet className="size-6" />
          </div>
          <CardTitle className="mt-4 text-xl">สร้างบัญชี merchant</CardTitle>
          <CardDescription className="mt-1">
            ใช้งานฟรีสำหรับเริ่มต้น — สร้างแอปและ API key ได้ทันทีหลังสมัคร
          </CardDescription>
        </div>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <FormInput
            id="reg-email"
            label="อีเมล"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormField id="reg-name" label="ชื่อที่แสดง (ไม่บังคับ)">
            <Input
              id="reg-name"
              type="text"
              autoComplete="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </FormField>
          <FormInput
            id="reg-password"
            label="รหัสผ่าน"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            hint="อย่างน้อย 8 ตัวอักษร"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err ? (
            <Alert variant="error">{err}</Alert>
          ) : null}
          <RecaptchaField
            layout="register"
            theme="light"
            accent="blue"
            captchaToken={captchaToken}
            onTokenChange={setCaptchaToken}
            captchaBust={captchaBust}
          />
          <Button type="submit" className="w-full" disabled={!captchaToken}>
            สมัครใช้งาน
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          มีบัญชีแล้ว?{' '}
          <Link
            to="/login"
            className="font-medium text-blue-600 no-underline hover:text-blue-700"
          >
            เข้าสู่ระบบ
          </Link>
        </p>
      </Card>
    </div>
  )
}
