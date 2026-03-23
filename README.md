# mcsv_pay_web_user

Merchant dashboard (React + Vite) สำหรับ MCSV Payment Gateway

## พัฒนา

```bash
npm install
npm run dev
```

Proxy ไป API ที่ `127.0.0.1:4002` (ดู `vite.config.ts`) — ดู `.env.example`: `VITE_API_URL` ใส่เฉพาะ origin (ห้าม `/api` ต่อท้าย); `VITE_PAY_PUBLIC_API_ORIGIN` สำหรับตัวอย่าง curl บน Landing

## Build

```bash
npm run build
```

ผลลัพธ์ใน `dist/` — deploy ที่โรต `pay.mcsv.me` (ดู `deploy/nginx-pay.example.conf` ใน repo API)
