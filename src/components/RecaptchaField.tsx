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
  theme?: 'light' | 'dark'
  accent?: 'blue' | 'orange'
  captchaToken: string | null
  onTokenChange: (token: string | null) => void
  /** เพิ่มทุกครั้งที่ submit ล้มเหลว เพื่อ reset widget */
  captchaBust?: number
}

export function RecaptchaField({
  layout,
  theme = 'light',
  accent = 'blue',
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
      theme,
      callback: (token: string) => onTokenRef.current(token),
      'expired-callback': () => onTokenRef.current(null),
      'error-callback': () => onTokenRef.current(null),
    })
  }, [layout, theme])

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

  const ring =
    accent === 'orange'
      ? {
          on: 'linear-gradient(135deg, #ea580c, #f97316, #ea580c)',
          off: 'linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b)',
          shadowOn: '0 0 20px rgba(234,88,12,0.15)',
          shadowOff: '0 0 20px rgba(245,158,11,0.12)',
        }
      : {
          on: 'linear-gradient(135deg, #2563eb, #3b82f6, #2563eb)',
          off: 'linear-gradient(135deg, #f59e0b, #ef4444, #f59e0b)',
          shadowOn: '0 0 20px rgba(37,99,235,0.15)',
          shadowOff: '0 0 20px rgba(245,158,11,0.12)',
        }

  return (
    <div className="flex justify-center">
      <div
        className="rounded-xl p-[2px] transition-all duration-700"
        style={{
          background: captchaToken ? ring.on : ring.off,
          boxShadow: captchaToken ? ring.shadowOn : ring.shadowOff,
        }}
      >
        <div
          className={
            theme === 'dark'
              ? 'min-h-[63px] min-w-[275px] overflow-hidden rounded-[10px] bg-slate-800'
              : 'min-h-[63px] min-w-[275px] overflow-hidden rounded-[10px] bg-white'
          }
        >
          <div
            ref={captchaRef}
            className="flex justify-center [&>div]:!rounded-lg"
            style={{ transform: 'scale(0.92)', transformOrigin: 'center' }}
          />
        </div>
      </div>
    </div>
  )
}
