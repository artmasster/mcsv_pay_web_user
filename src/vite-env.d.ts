/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string
  /** default https://api-pay.mcsv.me — ใช้ในหน้า Landing ตัวอย่าง curl /v1 */
  readonly VITE_PAY_PUBLIC_API_ORIGIN?: string
  /** @deprecated ใช้ VITE_PAY_PUBLIC_API_ORIGIN */
  readonly VITE_PGW_PUBLIC_API_ORIGIN?: string
  readonly VITE_RECAPTCHA_SITE_KEY?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
