/**
 * ศูนย์กลางค่า environment สำหรับ MCSV Pay web-user
 *
 * - VITE_API_URL — base URL ของ axios (ว่าง = same-origin: หน้าเว็บเดียวกับที่เปิด + path /api/...)
 *   ใส่เฉพาะ origin เช่น https://pay.mcsv.me หรือ https://api-pay.mcsv.me
 *   ห้ามใส่ path /api ต่อท้าย (จะถูกตัดออกอัตโนมัติ)
 *
 * - VITE_PAY_PUBLIC_API_ORIGIN — โดเมนสำหรับ merchant เรียก REST ภายนอก (POST /v1/payments)
 *   default: https://api-pay.mcsv.me
 */

function trimOrigin(raw: string | undefined): string {
  if (raw == null) return ''
  let s = String(raw).trim()
  if (!s) return ''
  s = s.replace(/\/+$/, '')
  if (s.endsWith('/api')) {
    s = s.slice(0, -4).replace(/\/+$/, '')
    if (import.meta.env.DEV) {
      console.warn(
        '[Pay] VITE_API_URL ไม่ควรลงท้ายด้วย /api — ใช้เฉพาะ origin แล้วตัด /api ให้แล้ว',
      )
    }
  }
  return s
}

/** Base สำหรับ axios — ว่างคือ relative บนโดเมนปัจจุบัน */
export function apiBaseUrl(): string {
  return trimOrigin(import.meta.env.VITE_API_URL)
}

/** โดเมน public API สำหรับเอกสาร / ตัวอย่าง curl (ไม่มี trailing slash) */
export function publicApiOrigin(): string {
  const legacy = trimOrigin(import.meta.env.VITE_PGW_PUBLIC_API_ORIGIN)
  const o = trimOrigin(import.meta.env.VITE_PAY_PUBLIC_API_ORIGIN)
  return o || legacy || 'https://api-pay.mcsv.me'
}
