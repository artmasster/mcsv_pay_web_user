import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PayLogoMark } from '@/components/PayLogoMark'
import { api } from '@/api/client'
import { RECAPTCHA_SITE_KEY } from '@/lib/recaptchaSiteKey'
import { loadRecaptcha } from '@/utils/loadRecaptcha'
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
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const renderCaptcha = useCallback(() => {
    const w = window as {
      grecaptcha?: { render: (el: HTMLElement, opts: object) => number; reset: (id: number) => void }
    }
    if (!w.grecaptcha?.render || !captchaRef.current) return
    if (widgetIdRef.current !== null) {
      w.grecaptcha.reset(widgetIdRef.current)
      widgetIdRef.current = null
    }
    widgetIdRef.current = w.grecaptcha.render(captchaRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme: 'light',
      callback: (token: string) => setCaptchaToken(token),
      'expired-callback': () => setCaptchaToken(null),
      'error-callback': () => setCaptchaToken(null),
    })
  }, [])

  useEffect(() => {
    loadRecaptcha().then(() => renderCaptcha())
  }, [renderCaptcha])

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
      localStorage.setItem('pay_merchant_token', data.token)
      nav('/dashboard')
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'สมัครไม่สำเร็จ')
      const w = window as { grecaptcha?: { reset: (id: number) => void } }
      if (widgetIdRef.current !== null) w.grecaptcha?.reset(widgetIdRef.current)
      setCaptchaToken(null)
    }
  }

  return (
    <div className="flex min-h-dvh w-full min-w-0 flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 px-4 py-10 sm:px-6">
      <Card className="w-full max-w-md shrink-0 shadow-lg">
        <div className="flex flex-col items-center text-center">
          <PayLogoMark className="size-12 shadow-sm" />
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
          <div className="my-6 flex justify-center">
            <div
              className="rounded-xl p-[2px] transition-all duration-700"
              style={{
                background: captchaToken
                  ? 'linear-gradient(135deg, #10b981, #06b6d4, #10b981)'
                  : 'linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b)',
                boxShadow: captchaToken
                  ? '0 0 20px rgba(16,185,129,0.15), 0 0 40px rgba(6,182,212,0.08)'
                  : '0 0 20px rgba(245,158,11,0.12), 0 0 40px rgba(239,68,68,0.06)',
              }}
            >
              <div className="min-h-[63px] min-w-[275px] overflow-hidden rounded-[10px] bg-white">
                <div
                  className="-mx-4 -my-2 flex justify-center bg-white [&_.g-recaptcha]:!rounded-lg [&_.g-recaptcha]:!bg-white"
                  style={{ transform: 'scale(0.92)', transformOrigin: 'center' }}
                >
                  <div ref={captchaRef} />
                </div>
              </div>
            </div>
          </div>
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
