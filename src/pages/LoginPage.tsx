import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { PayLogoMark } from '@/components/PayLogoMark'
import { api } from '@/api/client'
import { RECAPTCHA_SITE_KEY } from '@/lib/recaptchaSiteKey'
import { loadRecaptcha } from '@/utils/loadRecaptcha'
import { Alert } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardTitle } from '@/components/ui/card'
import { FormInput } from '@/components/ui/form-field'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function LoginPage() {
  const nav = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [err, setErr] = useState('')
  const [needs2fa, setNeeds2fa] = useState(false)
  const [twoFaToken, setTwoFaToken] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [captchaToken, setCaptchaToken] = useState<string | null>(null)
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)

  const renderCaptcha = useCallback(() => {
    if (!captchaRef.current || widgetIdRef.current !== null) return
    const w = window as { grecaptcha?: { render: (el: HTMLElement, opts: object) => number } }
    if (!w.grecaptcha?.render) return
    widgetIdRef.current = w.grecaptcha.render(captchaRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme: 'dark',
      callback: (token: string) => setCaptchaToken(token),
      'expired-callback': () => setCaptchaToken(null),
    })
  }, [])

  useEffect(() => {
    loadRecaptcha().then(() => renderCaptcha())
  }, [renderCaptcha])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.post<{
        token?: string
        requires_2fa?: boolean
        two_fa_token?: string
      }>('/api/merchant/auth/login', {
        email,
        password,
        recaptcha_token: captchaToken || undefined,
      })
      if (data.requires_2fa && data.two_fa_token) {
        setTwoFaToken(data.two_fa_token)
        setNeeds2fa(true)
        return
      }
      if (data.token) {
        localStorage.setItem('pay_merchant_token', data.token)
        nav('/dashboard')
      }
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'เข้าสู่ระบบไม่สำเร็จ')
      const w = window as { grecaptcha?: { reset: (id: number) => void } }
      if (w.grecaptcha && widgetIdRef.current !== null) {
        w.grecaptcha.reset(widgetIdRef.current)
        setCaptchaToken(null)
      }
    } finally {
      setLoading(false)
    }
  }

  async function submit2fa(e: FormEvent) {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const { data } = await api.post<{ token: string }>('/api/merchant/auth/2fa/verify', {
        two_fa_token: twoFaToken,
        code: totpCode.trim(),
      })
      localStorage.setItem('pay_merchant_token', data.token)
      nav('/dashboard')
    } catch (x: unknown) {
      const ax = x as { response?: { data?: { error?: string } } }
      setErr(ax.response?.data?.error || 'รหัส 2FA ไม่ถูกต้อง')
    } finally {
      setLoading(false)
    }
  }

  if (needs2fa) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 px-4 py-10">
        <Card className="w-full max-w-md shadow-lg">
          <div className="flex flex-col items-center text-center">
            <PayLogoMark className="size-12 shadow-sm" />
            <CardTitle className="mt-4 text-xl">ยืนยันตัวตน 2FA</CardTitle>
            <CardDescription className="mt-1">
              กรอกรหัส 6 หลักจากแอป Authenticator
            </CardDescription>
          </div>
          <form className="mt-8 space-y-4" onSubmit={submit2fa}>
            <div className="space-y-1.5">
              <Label htmlFor="totp">รหัสยืนยัน</Label>
              <Input
                id="totp"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              />
            </div>
            {err ? <Alert variant="error">{err}</Alert> : null}
            <Button
              type="submit"
              className="w-full"
              disabled={loading || totpCode.length !== 6}
            >
              เข้าสู่ระบบ
            </Button>
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={() => {
                setNeeds2fa(false)
                setTwoFaToken('')
                setTotpCode('')
                setErr('')
                const w = window as { grecaptcha?: { reset: (id: number) => void } }
                if (w.grecaptcha && widgetIdRef.current !== null) {
                  w.grecaptcha.reset(widgetIdRef.current)
                  setCaptchaToken(null)
                }
              }}
            >
              กลับ
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-gradient-to-br from-blue-50 via-slate-50 to-slate-100 px-4 py-10">
      <Card className="w-full max-w-md shadow-lg">
        <div className="flex flex-col items-center text-center">
          <PayLogoMark className="size-12 shadow-sm" />
          <CardTitle className="mt-4 text-xl">เข้าสู่ระบบ</CardTitle>
          <CardDescription className="mt-1">
            จัดการแอป API keys และธุรกรรมของคุณ
          </CardDescription>
        </div>
        <form className="mt-8 space-y-4" onSubmit={submit}>
          <FormInput
            id="login-email"
            label="อีเมล"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <FormInput
            id="login-password"
            label="รหัสผ่าน"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {err ? (
            <Alert variant="error">{err}</Alert>
          ) : null}
          <div className="flex justify-center">
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
              <div className="min-h-[63px] min-w-[275px] overflow-hidden rounded-[10px] bg-[#1e2030]">
                <div
                  ref={captchaRef}
                  className="-mx-4 -my-2 flex justify-center [&>div]:!rounded-lg"
                  style={{ transform: 'scale(0.92)', transformOrigin: 'center' }}
                />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={loading || !captchaToken}
          >
            เข้าสู่ระบบ
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate-500">
          ยังไม่มีบัญชี?{' '}
          <Link
            to="/register"
            className="font-medium text-blue-600 no-underline hover:text-blue-700"
          >
            สมัครใช้งาน
          </Link>
        </p>
      </Card>
    </div>
  )
}
