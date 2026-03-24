import { ArrowRight, BookOpen, CheckCircle2, Code2, Server, Shield, Webhook, XCircle } from 'lucide-react'
import { DocsCodeTabs } from '@/components/DocsCodeTabs'
import { PublicNav } from '@/components/PublicNav'
import { Code } from '@/components/ui/code'
import { publicApiOrigin } from '@/config/pay'
import {
  samplesCancelPayment,
  samplesCreatePayment,
  samplesGetPayment,
  samplesVerifyWebhook,
} from '@/lib/docsCodeSamples'

const sections = [
  { id: 'quickstart', label: 'เริ่มต้น' },
  { id: 'create', label: 'สร้างรายการ' },
  { id: 'get', label: 'เช็คสถานะ' },
  { id: 'cancel', label: 'ยกเลิกรายการ' },
  { id: 'webhook', label: 'Webhook' },
  { id: 'verify', label: 'เช็คลายเซ็น' },
] as const

function MethodBadge({ method, className }: { method: string; className?: string }) {
  const color =
    method === 'POST'
      ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
      : 'bg-blue-100 text-blue-800 border-blue-200'
  return (
    <span className={`inline-block rounded-md border px-2 py-0.5 font-mono text-xs font-bold ${color} ${className ?? ''}`}>
      {method}
    </span>
  )
}

function Endpoint({ method, path }: { method: string; path: string }) {
  return (
    <div className="flex items-center gap-2">
      <MethodBadge method={method} />
      <code className="text-sm font-semibold text-slate-900">{path}</code>
    </div>
  )
}

function ParamRow({ name, type, required, children }: { name: string; type: string; required?: boolean; children: React.ReactNode }) {
  return (
    <tr>
      <td className="px-4 py-2.5 align-top">
        <code className="text-xs font-semibold text-slate-900">{name}</code>
        {required && <span className="ml-1.5 text-[0.6rem] font-bold uppercase text-red-500">จำเป็น</span>}
      </td>
      <td className="px-4 py-2.5 align-top font-mono text-xs text-slate-500">{type}</td>
      <td className="px-4 py-2.5 align-top text-sm text-slate-600">{children}</td>
    </tr>
  )
}

function SectionCard({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      {children}
    </section>
  )
}

function Callout({ variant, children }: { variant: 'info' | 'warn'; children: React.ReactNode }) {
  const style =
    variant === 'warn'
      ? 'border-amber-200 bg-amber-50/60 text-amber-900'
      : 'border-blue-200 bg-blue-50/60 text-blue-900'
  return <div className={`mt-4 rounded-xl border px-4 py-3 text-sm leading-relaxed ${style}`}>{children}</div>
}

export function DocsPage() {
  const origin = publicApiOrigin()

  return (
    <div className="min-h-dvh bg-slate-50">
      <PublicNav />

      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          {/* Sidebar */}
          <aside className="lg:w-48 lg:shrink-0">
            <nav className="sticky top-24 space-y-0.5 rounded-xl border border-slate-200 bg-white p-2.5 text-sm shadow-sm">
              <p className="mb-2 flex items-center gap-2 px-2 font-semibold text-slate-900">
                <BookOpen className="size-4 text-blue-600" />
                สารบัญ
              </p>
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block rounded-lg px-2.5 py-1.5 text-slate-500 no-underline transition-colors hover:bg-slate-50 hover:text-slate-900"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <div className="min-w-0 flex-1 space-y-8">
            {/* Hero */}
            <header className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                <Code2 className="size-3.5" />
                สำหรับนักพัฒนา
              </div>
              <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                เชื่อม MCSV Pay กับระบบของคุณ
              </h1>
              <p className="mt-3 max-w-2xl text-[0.9375rem] leading-relaxed text-slate-600">
                เรียก API จาก backend ของคุณเพื่อสร้างรายการชำระ แล้วรอรับ webhook เมื่อลูกค้าจ่ายเงินสำเร็จ ทั้งหมดนี้ใช้แค่ 3 endpoint
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                <span>
                  Base URL: <Code className="text-xs">{origin}</Code>
                </span>
                <span>
                  Auth: <Code className="text-xs">Bearer pay_sk_...</Code>
                </span>
                <span>
                  Format: <Code className="text-xs">JSON</Code>
                </span>
              </div>
            </header>

            {/* Quick Start */}
            <SectionCard id="quickstart">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <ArrowRight className="size-5 text-blue-600" />
                เริ่มต้นใช้งาน
              </h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    step: 1,
                    title: 'สร้างแอปในแดชบอร์ด',
                    desc: 'เก็บ webhook_secret ไว้ ใช้ตรวจลายเซ็นภายหลัง',
                  },
                  {
                    step: 2,
                    title: 'ออก API Key',
                    desc: (
                      <>
                        จะได้คีย์ <Code className="text-[0.7rem]">pay_sk_...</Code> ใช้ยิง API จาก server ของคุณ
                      </>
                    ),
                  },
                  {
                    step: 3,
                    title: 'เรียก POST /v1/payments',
                    desc: 'ระบบจะคืน QR PromptPay ให้ลูกค้าสแกนจ่าย',
                  },
                ].map((s) => (
                  <div key={s.step} className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <div className="flex size-7 items-center justify-center rounded-lg bg-blue-600 text-xs font-bold text-white">
                      {s.step}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-slate-900">{s.title}</h3>
                    <p className="mt-1 text-[0.8125rem] leading-relaxed text-slate-500">{s.desc}</p>
                  </div>
                ))}
              </div>
              <Callout variant="info">
                <strong>หมายเหตุ:</strong> ห้ามเอา API key ไปใส่ฝั่ง client (เบราว์เซอร์, แอปมือถือ) เด็ดขาด ต้องเรียกจาก server เท่านั้น
              </Callout>
            </SectionCard>

            {/* POST /v1/payments */}
            <SectionCard id="create">
              <Endpoint method="POST" path="/v1/payments" />
              <p className="mt-3 text-sm text-slate-600">
                สร้างรายการชำระเงินใหม่ ระบบจะสุ่มยอดทศนิยม (เช่น 299.42) เพื่อจับคู่กับยอดโอนจริง
                แล้วส่ง QR PromptPay กลับมาให้เอาไปแสดงให้ลูกค้าสแกน
              </p>

              <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">พารามิเตอร์</h3>
              <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">ชื่อ</th>
                      <th className="px-4 py-2.5 font-semibold">ชนิด</th>
                      <th className="px-4 py-2.5 font-semibold">คำอธิบาย</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <ParamRow name="amount" type="string" required>
                      จำนวนเงิน (บาท) เช่น <Code className="text-[0.7rem]">"299"</Code> หรือ{' '}
                      <Code className="text-[0.7rem]">"49.50"</Code>
                    </ParamRow>
                    <ParamRow name="client_reference" type="string">
                      รหัสอ้างอิงฝั่งคุณ เช่น เลข order — จะส่งกลับมาใน webhook ด้วย
                    </ParamRow>
                    <ParamRow name="metadata" type="object">
                      ข้อมูลเพิ่มเติมอะไรก็ได้ เก็บใน JSON แล้วจะส่งกลับมาใน webhook เหมือนเดิม
                    </ParamRow>
                    <ParamRow name="idempotency_key" type="string">
                      ป้องกันสร้างซ้ำ ถ้าส่งคีย์เดิมจะได้รายการเดิมกลับมา
                    </ParamRow>
                  </tbody>
                </table>
              </div>

              <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">Response 200</h3>
              <pre className="mt-2 overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-[0.8rem] leading-relaxed text-slate-100">
                <code>{`{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "status": "pending",
  "amount": "299",
  "amount_with_decimal": "299.42",
  "client_reference": "order-1234",
  "metadata": { "user_id": "u42" },
  "expired_at": "2026-03-23T15:30:00Z",
  "promptpay_qr": "00020101021230...",
  "truewallet_phone": "08x-xxx-xxxx",
  "truewallet_full_name": "ชื่อบัญชีรับเงิน"
}`}</code>
              </pre>
              <p className="mt-2 text-xs text-slate-500">
                เอาค่า <Code className="text-[0.65rem]">promptpay_qr</Code> ไปสร้าง QR Code ให้ลูกค้าสแกนจ่ายได้เลย
              </p>

              <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">ตัวอย่าง</h3>
              <DocsCodeTabs tabs={samplesCreatePayment(origin)} className="mt-2" />
            </SectionCard>

            {/* GET /v1/payments/:id */}
            <SectionCard id="get">
              <Endpoint method="GET" path="/v1/payments/{id}" />
              <p className="mt-3 text-sm text-slate-600">
                ดึงข้อมูลรายการชำระ ใช้เช็คสถานะปัจจุบัน (<Code className="text-[0.7rem]">pending</Code>, <Code className="text-[0.7rem]">completed</Code>, <Code className="text-[0.7rem]">cancelled</Code>)
              </p>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">ตัวอย่าง</h3>
              <DocsCodeTabs tabs={samplesGetPayment(origin)} className="mt-2" />
            </SectionCard>

            {/* POST /v1/payments/:id/cancel */}
            <SectionCard id="cancel">
              <Endpoint method="POST" path="/v1/payments/{id}/cancel" />
              <p className="mt-3 text-sm text-slate-600">
                ยกเลิกรายการที่ยังเป็น <Code className="text-[0.7rem]">pending</Code> อยู่
                ถ้าตั้ง webhook URL ไว้ ระบบจะส่ง event <Code className="text-[0.7rem]">payment.cancelled</Code> ให้ด้วย
              </p>
              <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">ตัวอย่าง</h3>
              <DocsCodeTabs tabs={samplesCancelPayment(origin)} className="mt-2" />
            </SectionCard>

            {/* Webhook */}
            <SectionCard id="webhook">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Webhook className="size-5 text-blue-600" />
                Webhook — รับแจ้งเตือนจาก MCSV Pay
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                เมื่อลูกค้าจ่ายเงินสำเร็จ หรือคุณยกเลิกรายการผ่าน API ระบบจะส่ง HTTP POST ไปที่ URL ที่คุณตั้งไว้ในแดชบอร์ด (ตั้งค่าในหน้าจัดการแอป)
              </p>

              {/* Flow */}
              <div className="mt-6 flex flex-wrap items-center gap-3 rounded-xl bg-slate-50 px-5 py-4 text-sm">
                <span className="rounded-lg bg-blue-100 px-2.5 py-1 font-medium text-blue-800">ลูกค้าจ่ายเงิน</span>
                <ArrowRight className="size-4 text-slate-400" />
                <span className="rounded-lg bg-violet-100 px-2.5 py-1 font-medium text-violet-800">MCSV Pay ยืนยันยอด</span>
                <ArrowRight className="size-4 text-slate-400" />
                <span className="rounded-lg bg-emerald-100 px-2.5 py-1 font-medium text-emerald-800">POST ไป webhook URL ของคุณ</span>
              </div>

              {/* Headers */}
              <h3 className="mt-8 text-xs font-bold uppercase tracking-wide text-slate-400">HTTP Headers ที่ส่งมา</h3>
              <div className="mt-2 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs text-slate-500">
                    <tr>
                      <th className="px-4 py-2.5 font-semibold">Header</th>
                      <th className="px-4 py-2.5 font-semibold">คำอธิบาย</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr>
                      <td className="px-4 py-2.5 font-mono text-xs">X-PAY-Event</td>
                      <td className="px-4 py-2.5">
                        ประเภท event เช่น <Code className="text-[0.7rem]">payment.completed</Code>
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono text-xs">X-PAY-Event-Id</td>
                      <td className="px-4 py-2.5">UUID สำหรับเช็คว่าเคยรับ event นี้แล้วหรือยัง (กัน duplicate)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono text-xs">X-PAY-Timestamp</td>
                      <td className="px-4 py-2.5">เวลาที่ส่ง (Unix millisecond)</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2.5 font-mono text-xs">X-PAY-Signature</td>
                      <td className="px-4 py-2.5">ลายเซ็น HMAC-SHA256 ใช้ยืนยันว่ามาจาก MCSV Pay จริง (ดูหัวข้อถัดไป)</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Events */}
              <h3 className="mt-8 text-xs font-bold uppercase tracking-wide text-slate-400">รูปแบบ JSON ที่ส่งมา</h3>
              <p className="mt-2 text-sm text-slate-500">ทุก event มีโครงสร้างเดียวกัน แตกต่างแค่ข้อมูลใน <Code className="text-[0.7rem]">data</Code></p>

              <div className="mt-4 space-y-4">
                <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-emerald-600" />
                    <h4 className="font-mono text-sm font-bold text-emerald-800">payment.completed</h4>
                    <span className="text-xs text-emerald-600">ลูกค้าจ่ายสำเร็จ</span>
                  </div>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-3.5 text-[0.8rem] leading-relaxed text-slate-800 ring-1 ring-emerald-200/60">
                    <code>{`{
  "event": "payment.completed",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "payment_id": "uuid",
    "status": "completed",
    "amount": "299",
    "amount_with_decimal": "299.42",
    "client_reference": "order-1234",
    "metadata": {},
    "provider_payment_ref": "อ้างอิงจากผู้ให้บริการ"
  }
}`}</code>
                  </pre>
                </div>

                <div className="rounded-xl border border-amber-200 bg-amber-50/30 p-4">
                  <div className="flex items-center gap-2">
                    <XCircle className="size-4 text-amber-600" />
                    <h4 className="font-mono text-sm font-bold text-amber-800">payment.cancelled</h4>
                    <span className="text-xs text-amber-600">ยกเลิกผ่าน API</span>
                  </div>
                  <pre className="mt-3 overflow-x-auto rounded-lg bg-white p-3.5 text-[0.8rem] leading-relaxed text-slate-800 ring-1 ring-amber-200/60">
                    <code>{`{
  "event": "payment.cancelled",
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "data": {
    "payment_id": "uuid",
    "status": "cancelled"
  }
}`}</code>
                  </pre>
                </div>
              </div>

              <Callout variant="info">
                ถ้า server ของคุณตอบกลับไม่สำเร็จ (ไม่ใช่ 2xx) ระบบจะลองส่งซ้ำให้อีกสูงสุดประมาณ 12 ครั้ง
              </Callout>
            </SectionCard>

            {/* Verify Signature */}
            <SectionCard id="verify">
              <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Shield className="size-5 text-blue-600" />
                เช็คลายเซ็น Webhook
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                ก่อนจะเชื่อข้อมูลจาก webhook ควรตรวจลายเซ็นก่อนเสมอ
                เพื่อให้แน่ใจว่ามาจาก MCSV Pay จริง ไม่ใช่คนอื่นปลอมยิงมา
              </p>

              <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">วิธีเช็ค</h3>
              <ol className="mt-3 space-y-3">
                {[
                  <>
                    เอา <Code className="text-[0.7rem]">X-PAY-Timestamp</Code> มาต่อกับ raw body
                    ด้วยจุด: <Code className="text-[0.7rem]">timestamp.raw_body</Code>
                  </>,
                  <>
                    ใช้ <Code className="text-[0.7rem]">webhook_secret</Code> ของแอปคำนวณ HMAC-SHA256 แล้วแปลงเป็น hex ตัวพิมพ์เล็ก
                  </>,
                  <>
                    เทียบค่าที่คำนวณได้กับ <Code className="text-[0.7rem]">X-PAY-Signature</Code> ที่ส่งมา ถ้าตรงกันก็ผ่าน
                  </>,
                ].map((text, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-blue-100 text-xs font-bold text-blue-700">
                      {i + 1}
                    </span>
                    <span className="leading-relaxed">{text}</span>
                  </li>
                ))}
              </ol>

              <Callout variant="warn">
                <strong>สำคัญ:</strong> ต้องใช้ raw body ดิบๆ ที่ได้รับมาตรงๆ อย่าเอาไป parse เป็น JSON แล้วค่อย stringify กลับ เพราะลำดับ key หรือ spacing อาจเปลี่ยน ทำให้ลายเซ็นไม่ตรง
              </Callout>

              <h3 className="mt-6 text-xs font-bold uppercase tracking-wide text-slate-400">ตัวอย่างโค้ด</h3>
              <DocsCodeTabs tabs={samplesVerifyWebhook()} className="mt-2" />
            </SectionCard>

            {/* Footer */}
            <div className="flex items-center gap-2.5 rounded-xl bg-slate-100 px-5 py-4 text-sm text-slate-500">
              <Server className="size-4 shrink-0 text-slate-400" />
              มีปัญหาหรือข้อสงสัย? ติดต่อทีม MCSV ผ่านช่องทางปกติได้เลย
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
