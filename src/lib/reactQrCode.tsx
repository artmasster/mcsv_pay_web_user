import type { ForwardRefExoticComponent, SVGProps } from 'react'
import raw from 'react-qr-code'

export type ReactQrCodeProps = SVGProps<SVGSVGElement> & {
  value: string
  size?: number
  bgColor?: string
  fgColor?: string
  level?: 'L' | 'M' | 'Q' | 'H'
  title?: string
}

function isForwardRefComponent(
  x: unknown,
): x is ForwardRefExoticComponent<ReactQrCodeProps> {
  return (
    typeof x === 'object' &&
    x !== null &&
    '$$typeof' in x &&
    (x as { $$typeof: symbol }).$$typeof === Symbol.for('react.forward_ref')
  )
}

/** default import จาก react-qr-code บางครั้งได้ object ห่อซ้อน — ใช้ตัวนี้แทน */
function unwrapReactQrCode(
  m: unknown,
): ForwardRefExoticComponent<ReactQrCodeProps> {
  if (isForwardRefComponent(m)) return m
  if (m !== null && typeof m === 'object' && 'default' in m) {
    const d = (m as { default: unknown }).default
    if (isForwardRefComponent(d)) return d
    if (d !== null && typeof d === 'object' && 'default' in d) {
      const inner = (d as { default: unknown }).default
      if (isForwardRefComponent(inner)) return inner
    }
  }
  throw new Error('react-qr-code: could not resolve component from default import')
}

export const QRCode = unwrapReactQrCode(raw)
