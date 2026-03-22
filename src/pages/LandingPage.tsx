import {
  ArrowRight,
  BadgePercent,
  Bell,
  Check,
  Code2,
  KeyRound,
  Layers,
  QrCode,
  Shield,
  Smartphone,
  UserPlus,
  Wallet,
  Webhook,
  Zap,
} from 'lucide-react'
import { publicApiOrigin } from '@/config/pgw'
import { PublicNav } from '@/components/PublicNav'
import { Code } from '@/components/ui/code'
import { LinkButton } from '@/components/ui/link-button'

export function LandingPage() {
  const logged = !!localStorage.getItem('pgw_merchant_token')

  return (
    <div className="min-h-dvh bg-white">
      <PublicNav />

      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative isolate overflow-hidden">
        <div className="hero-grid-bg hero-radial-mask pointer-events-none absolute inset-0 -z-10" />
        <div
          className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-[480px] w-[720px] -translate-x-1/2 rounded-full opacity-30 blur-3xl"
          style={{
            background:
              'radial-gradient(ellipse, rgba(59,130,246,0.25), rgba(147,51,234,0.10), transparent 70%)',
          }}
        />

        <div className="mx-auto max-w-6xl px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="animate-fade-in inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium text-blue-700">
              <Zap className="size-3.5" />
              Payment Gateway สำหรับนักพัฒนา
            </div>
            <h1 className="animate-fade-in-up delay-100 mt-6 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              รับชำระเงินออนไลน์
              <br />
              <span className="bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                แบบมืออาชีพ
              </span>
            </h1>
            <p className="animate-fade-in-up delay-200 mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-slate-600">
              เชื่อม PromptPay / TrueWallet ผ่าน API เดียว รองรับหลายโปรเจกต์ หลายแอปพลิเคชัน
              พร้อม webhook ลายเซ็นตรวจสอบได้ — เหมาะกับธุรกิจที่ต้องการความน่าเชื่อถือ
            </p>
            <div className="animate-fade-in-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-4">
              {logged ? (
                <LinkButton to="/dashboard" size="lg" className="px-8">
                  ไปแดชบอร์ด
                  <ArrowRight className="size-4" />
                </LinkButton>
              ) : (
                <>
                  <LinkButton to="/register" size="lg" className="px-8">
                    เริ่มใช้งานฟรี
                    <ArrowRight className="size-4" />
                  </LinkButton>
                  <LinkButton to="/login" variant="secondary" size="lg">
                    เข้าสู่ระบบ
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-slate-50/80">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px sm:grid-cols-4">
          {[
            { value: '< 100ms', label: 'API Response' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: 'HMAC', label: 'Webhook Signature' },
            { value: 'ไม่จำกัด', label: 'แอปพลิเคชัน' },
          ].map((s) => (
            <div key={s.label} className="px-4 py-8 text-center sm:px-6">
              <div className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
                {s.value}
              </div>
              <div className="mt-1 text-sm text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            ทำไมต้อง MCSV Pay
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
            โครงสร้างแยกจากระบบเกมเซิร์ฟเวอร์โดยตรง — ข้อมูลการชำระเงินและ API keys
            จัดการผ่านแดชบอร์ดเฉพาะ
          </p>
        </div>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Layers className="size-5" />}
            title="หลายแอป หนึ่งบัญชี"
            description="สร้างแอปพลิเคชันย่อยได้ไม่จำกัด แต่ละแอปมี API key และ webhook แยกกัน เหมาะกับทีมที่มีหลายระบบ"
          />
          <FeatureCard
            icon={<Webhook className="size-5" />}
            title="Webhook ที่ตรวจสอบได้"
            description={
              <>
                รับแจ้งเตือนแบบ real-time พร้อมหัว <Code>X-PGW-Signature</Code> สำหรับยืนยัน
                HMAC — ลดความเสี่ยงคำสั่งปลอม
              </>
            }
          />
          <FeatureCard
            icon={<QrCode className="size-5" />}
            title="PromptPay / TrueMoney"
            description="สร้าง QR ตามมาตรฐานสำหรับลูกค้าสแกนจ่าย ยอดโอนมีเลขทศนิยมอ้างอิงเพื่อจับคู่อัตโนมัติ"
          />
          <FeatureCard
            icon={<Shield className="size-5" />}
            title="ความปลอดภัยระดับ API"
            description="ทุกคีย์ถูกเข้ารหัสฝั่งเซิร์ฟเวอร์ หมุน secret ได้ทุกเมื่อ ยกเลิกคีย์แบบ instant"
          />
          <FeatureCard
            icon={<Smartphone className="size-5" />}
            title="รองรับมือถือ"
            description="หน้าชำระเงินและแดชบอร์ดออกแบบ responsive ใช้งานได้ดีทั้งเดสก์ท็อปและโทรศัพท์"
          />
          <FeatureCard
            icon={<Bell className="size-5" />}
            title="แจ้งเตือนทันที"
            description="เมื่อลูกค้าชำระสำเร็จ ระบบจะ POST ไปยัง webhook ทันทีพร้อม payload ครบถ้วน"
          />
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              เริ่มต้นใน 3 ขั้นตอน
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              จากสมัครบัญชีถึงรับเงินจริง ใช้เวลาไม่ถึง 5 นาที
            </p>
          </div>
          <div className="relative mx-auto mt-14 max-w-4xl">
            <div
              className="absolute top-7 hidden h-0.5 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-200 sm:block"
              style={{ left: 'calc(16.67% + 28px)', right: 'calc(16.67% + 28px)' }}
              aria-hidden
            />
            <div className="grid gap-8 sm:grid-cols-3">
              <StepCard
                step={1}
                icon={<UserPlus className="size-5" />}
                title="สมัครและสร้างแอป"
                description="ลงทะเบียนบัญชี merchant จากนั้นสร้างแอปพลิเคชันและเก็บ webhook secret"
              />
              <StepCard
                step={2}
                icon={<KeyRound className="size-5" />}
                title="ออก API key"
                description="สร้างคีย์สำหรับเรียก REST API สร้างรายการชำระจาก backend ของคุณ"
              />
              <StepCard
                step={3}
                icon={<Wallet className="size-5" />}
                title="รับเงินผ่าน Webhook"
                description="เมื่อลูกค้าจ่ายสำเร็จ ระบบจะ POST ไป URL ที่ตั้งไว้ พร้อม payload และลายเซ็น"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-1.5 text-sm font-medium text-emerald-700">
              <BadgePercent className="size-3.5" />
              ค่าธรรมเนียมโปร่งใส
            </div>
            <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              ราคาเดียว เข้าใจง่าย
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-slate-600">
              ไม่มีค่าสมัคร ไม่มีรายเดือน — จ่ายเฉพาะเมื่อมีธุรกรรมจริง
            </p>
          </div>

          <div className="mx-auto mt-14 max-w-lg">
            <div className="rainbow-border rounded-2xl p-[2.5px] shadow-xl">
              <div className="overflow-hidden rounded-[calc(1rem-2.5px)] bg-gradient-to-b from-blue-50 to-white">
                <div className="px-8 pt-8 text-center">
                  <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                    ทุกช่องทาง · ทุกยอด
                  </p>
                  <div className="mt-3 flex items-baseline justify-center gap-1">
                    <span className="text-5xl font-extrabold tracking-tight text-slate-900">
                      8
                    </span>
                    <span className="ml-1 text-lg font-bold text-slate-500">บาท</span>
                  </div>
                  <p className="mt-2 text-sm text-slate-500">
                    ต่อรายการ · PromptPay & TrueMoney
                  </p>
                </div>

                <div className="mt-8 border-t border-blue-100 bg-white px-8 py-6">
                  <ul className="space-y-3">
                    {[
                      'PromptPay QR + TrueMoney Wallet',
                      'ไม่มีค่าสมัคร / ค่ารายเดือน',
                      'สร้างแอปพลิเคชันได้ไม่จำกัด',
                      'Webhook + HMAC Signature',
                      'แดชบอร์ดดูธุรกรรม real-time',
                      'หมุน API key / secret ได้ทุกเมื่อ',
                    ].map((item) => (
                      <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                        <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-slate-100 bg-slate-50/60 px-8 py-6">
                  <p className="text-center text-xs font-medium text-slate-500">
                    ไม่ว่ายอดเท่าไหร่ ค่าธรรมเนียมเท่ากัน
                  </p>
                  <div className="mt-3 grid grid-cols-3 gap-3 text-center">
                    {[
                      { amount: '50฿', fee: '8฿' },
                      { amount: '500฿', fee: '8฿' },
                      { amount: '5,000฿', fee: '8฿' },
                    ].map((ex) => (
                      <div key={ex.amount} className="rounded-lg bg-white px-3 py-2.5 shadow-sm ring-1 ring-slate-200">
                        <div className="text-xs text-slate-500">ยอด {ex.amount}</div>
                        <div className="mt-0.5 text-sm font-bold text-emerald-600">{ex.fee}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Code preview ─────────────────────────────────────── */}
      <section className="border-t border-slate-200 bg-slate-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <div className="flex flex-col items-start gap-12 lg:flex-row lg:gap-16">
            <div className="lg:w-5/12">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-xs font-medium text-slate-300">
                <Code2 className="size-3.5" />
                Developer-first
              </div>
              <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
                ใช้งานง่าย เรียกได้จากทุกภาษา
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-400">
                สร้างรายการชำระด้วย <Code className="border border-slate-600 bg-slate-800 text-blue-300">POST /v1/payments</Code> เพียง
                endpoint เดียว — ได้ QR PromptPay กลับมาทันที พร้อม webhook เมื่อชำระสำเร็จ
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {!logged && (
                  <LinkButton to="/register" size="lg" className="px-8">
                    เริ่มใช้งานฟรี
                    <ArrowRight className="size-4" />
                  </LinkButton>
                )}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                  <span className="size-3 rounded-full bg-red-500/80" />
                  <span className="size-3 rounded-full bg-yellow-500/80" />
                  <span className="size-3 rounded-full bg-green-500/80" />
                  <span className="ml-3 text-xs text-slate-500">create-payment.sh</span>
                </div>
                <pre className="overflow-x-auto p-5 text-[0.8rem] leading-relaxed">
                  <code>
                    <span className="text-slate-500">{'# สร้างรายการชำระเงินใหม่'}</span>
                    {'\n'}
                    <span className="text-emerald-400">curl</span>
                    <span className="text-slate-300">{` -X POST ${publicApiOrigin()}/v1/payments \\`}</span>
                    {'\n'}
                    <span className="text-slate-300">{'  -H '}</span>
                    <span className="text-amber-300">{'"Authorization: Bearer pgw_sk_..."'}</span>
                    <span className="text-slate-300">{' \\'}</span>
                    {'\n'}
                    <span className="text-slate-300">{'  -H '}</span>
                    <span className="text-amber-300">{'"Content-Type: application/json"'}</span>
                    <span className="text-slate-300">{' \\'}</span>
                    {'\n'}
                    <span className="text-slate-300">{'  -d '}</span>
                    <span className="text-amber-300">{"'"}</span>
                    <span className="text-sky-300">{'{'}</span>
                    {'\n'}
                    <span className="text-sky-300">{'    '}</span>
                    <span className="text-violet-400">{'"amount"'}</span>
                    <span className="text-sky-300">:</span>
                    <span className="text-orange-300">{' 299'}</span>
                    <span className="text-sky-300">,</span>
                    {'\n'}
                    <span className="text-sky-300">{'    '}</span>
                    <span className="text-violet-400">{'"client_reference"'}</span>
                    <span className="text-sky-300">:</span>
                    <span className="text-amber-300">{' "order-1234"'}</span>
                    {'\n'}
                    <span className="text-sky-300">{'  }'}</span>
                    <span className="text-amber-300">{"'"}</span>
                  </code>
                </pre>
              </div>
              <div className="mt-4 overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
                  <span className="text-xs text-slate-500">Response 200</span>
                </div>
                <pre className="overflow-x-auto p-5 text-[0.8rem] leading-relaxed">
                  <code>
                    <span className="text-sky-300">{'{'}</span>
                    {'\n'}
                    <span className="text-sky-300">{'  '}</span>
                    <span className="text-violet-400">{'"id"'}</span>
                    <span className="text-sky-300">:</span>
                    <span className="text-amber-300">{' "pay_a1b2c3d4..."'}</span>
                    <span className="text-sky-300">,</span>
                    {'\n'}
                    <span className="text-sky-300">{'  '}</span>
                    <span className="text-violet-400">{'"status"'}</span>
                    <span className="text-sky-300">:</span>
                    <span className="text-amber-300">{' "pending"'}</span>
                    <span className="text-sky-300">,</span>
                    {'\n'}
                    <span className="text-sky-300">{'  '}</span>
                    <span className="text-violet-400">{'"amount_with_decimal"'}</span>
                    <span className="text-sky-300">:</span>
                    <span className="text-amber-300">{' "299.42"'}</span>
                    <span className="text-sky-300">,</span>
                    {'\n'}
                    <span className="text-sky-300">{'  '}</span>
                    <span className="text-violet-400">{'"promptpay_qr"'}</span>
                    <span className="text-sky-300">:</span>
                    <span className="text-amber-300">{' "00020101021230..."'}</span>
                    <span className="text-sky-300">,</span>
                    {'\n'}
                    <span className="text-sky-300">{'  '}</span>
                    <span className="text-violet-400">{'"expired_at"'}</span>
                    <span className="text-sky-300">:</span>
                    <span className="text-amber-300">{' "2026-03-22T15:30:00Z"'}</span>
                    {'\n'}
                    <span className="text-sky-300">{'}'}</span>
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      {!logged && (
        <section className="relative isolate overflow-hidden bg-blue-600">
          <div
            className="pointer-events-none absolute inset-0 -z-10 opacity-20"
            style={{
              backgroundImage:
                'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.15), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.10), transparent 40%)',
            }}
          />
          <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 sm:py-24">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              พร้อมรับชำระเงินแล้วหรือยัง?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-blue-100">
              สมัครบัญชี merchant ฟรี — สร้างแอป ออก API key และเริ่มรับเงินได้ภายไม่กี่นาที
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <LinkButton
                to="/register"
                variant="ghost"
                size="lg"
                className="border border-white bg-white px-8 text-blue-700 shadow-lg hover:bg-blue-50 hover:text-blue-800"
              >
                สมัครฟรี
                <ArrowRight className="size-4" />
              </LinkButton>
              <LinkButton
                to="/login"
                variant="ghost"
                size="lg"
                className="border border-blue-300/40 px-8 text-white hover:bg-white/10"
              >
                เข้าสู่ระบบ
              </LinkButton>
            </div>
          </div>
        </section>
      )}

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-2.5">
              <div className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-white">
                <Wallet className="size-4" />
              </div>
              <span className="text-sm font-bold tracking-tight text-slate-900">
                MCSV<span className="text-blue-600"> Pay</span>
              </span>
            </div>
            <p className="text-sm text-slate-500">
              © {new Date().getFullYear()} MCSV · Pay Gateway · สอบถามเพิ่มเติมผ่านช่องทางของ
              MCSV
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

/* ── Reusable sub-components ──────────────────────────────── */

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: React.ReactNode
}) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:border-blue-200 hover:shadow-md">
      <div className="flex size-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  )
}

function StepCard({
  step,
  icon,
  title,
  description,
}: {
  step: number
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="relative flex flex-col items-center text-center">
      <div className="relative z-10 flex size-14 items-center justify-center rounded-2xl border-2 border-blue-200 bg-blue-50 text-blue-600 shadow-sm">
        {icon}
        <span className="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-blue-600 text-[0.65rem] font-bold text-white">
          {step}
        </span>
      </div>
      <h3 className="mt-5 text-base font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-xs text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  )
}
