import { useCallback, useEffect, useRef } from 'react'
import { RECAPTCHA_SITE_KEY } from '@/lib/recaptchaSiteKey'
import { loadRecaptcha } from '@/utils/loadRecaptcha'

type GrecaptchaWindow = Window & {
  grecaptcha?: {
    render: (
      el: HTMLElement,
      opts: {
        sitekey: string
        theme?: 'light' | 'dark'
        callback: (token: string) => void
        'expired-callback'?: () => void
        'error-callback'?: () => void
      },
    ) => number
    reset: (id: number) => void
  }
}

type Props = {
  layout: 'login' | 'register'
  captchaToken: string | null
  onTokenChange: (token: string | null) => void
  /** เพิ่มทุกครั้งที่ submit ล้มเหลว เพื่อ reset widget */
  captchaBust?: number
}

export function RecaptchaField({
  layout,
  captchaToken,
  onTokenChange,
  captchaBust = 0,
}: Props) {
  const captchaRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<number | null>(null)
  const onTokenRef = useRef(onTokenChange)
  onTokenRef.current = onTokenChange

  const renderCaptcha = useCallback(() => {
    const w = window as GrecaptchaWindow
    if (!w.grecaptcha?.render || !captchaRef.current) return

    if (layout === 'register') {
      if (widgetIdRef.current !== null) {
        w.grecaptcha.reset(widgetIdRef.current)
        widgetIdRef.current = null
      }
    } else if (widgetIdRef.current !== null) {
      return
    }

    widgetIdRef.current = w.grecaptcha.render(captchaRef.current, {
      sitekey: RECAPTCHA_SITE_KEY,
      theme: 'dark',
      callback: (token: string) => onTokenRef.current(token),
      'expired-callback': () => onTokenRef.current(null),
      ...(layout === 'register'
        ? { 'error-callback': () => onTokenRef.current(null) }
        : {}),
    })
  }, [layout])

  useEffect(() => {
    loadRecaptcha().then(() => renderCaptcha())
  }, [renderCaptcha])

  useEffect(() => {
    if (captchaBust === 0) return
    const w = window as GrecaptchaWindow
    if (widgetIdRef.current !== null) {
      w.grecaptcha?.reset(widgetIdRef.current)
      onTokenRef.current(null)
    }
  }, [captchaBust])

  return (
    <div
      className={
        layout === 'register' ? 'flex justify-center my-6' : 'flex justify-center'
      }
    >
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
        <div
          className={
            layout === 'register'
              ? 'rounded-[10px] bg-[#222] overflow-hidden min-w-[275px] min-h-[63px]'
              : 'rounded-[10px] bg-[#1e2030] overflow-hidden min-w-[275px] min-h-[63px]'
          }
        >
          <div
            ref={captchaRef}
            className={
              layout === 'register'
                ? 'flex justify-center [&>div]:!rounded-lg -mx-4 -my-2 bg-[#222]'
                : 'flex justify-center [&>div]:!rounded-lg -mx-4 -my-2'
            }
            style={{ transform: 'scale(0.92)', transformOrigin: 'center' }}
          />
        </div>
      </div>
    </div>
  )
}
