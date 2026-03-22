# mcsv_pgw_web_user

Merchant dashboard (React + Vite) สำหรับ MCSV Payment Gateway

## พัฒนา

```bash
npm install
npm run dev
```

Proxy ไป API ที่ `127.0.0.1:4002` (ดู `vite.config.ts`) — ตั้ง `VITE_API_URL` ถ้าโหลด API คนละโดเมน

## Build

```bash
npm run build
```

ผลลัพธ์ใน `dist/` — deploy ที่โรต `pgw.mcsv.me` (ดูตัวอย่าง Nginx ใน repo API)
