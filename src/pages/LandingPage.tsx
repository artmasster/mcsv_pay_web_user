import { Link } from 'react-router-dom'
import { PublicNav } from '../components/PublicNav'

export function LandingPage() {
  const logged = !!localStorage.getItem('pgw_merchant_token')

  return (
    <>
      <PublicNav />
      <main>
        <section className="landing-hero">
          <h1>รับชำระเงินออนไลน์แบบมืออาชีพ</h1>
          <p className="lead">
            เชื่อม PromptPay / TrueWallet ผ่าน API เดียว รองรับหลายโปรเจกต์ หลายแอปพลิเคชัน
            พร้อม webhook ลายเซ็นตรวจสอบได้ — เหมาะกับธุรกิจที่ต้องการความน่าเชื่อถือ
          </p>
          <div className="landing-cta">
            {logged ? (
              <Link to="/dashboard" className="btn btn-primary">
                ไปแดชบอร์ด
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary" style={{ textDecoration: 'none' }}>
                  เริ่มใช้งานฟรี
                </Link>
                <Link to="/login" className="btn btn-secondary" style={{ textDecoration: 'none' }}>
                  เข้าสู่ระบบ
                </Link>
              </>
            )}
          </div>
        </section>

        <div className="trust-strip">
          <p>
            โครงสร้างแยกจากระบบเกมเซิร์ฟเวอร์โดยตรง — ข้อมูลการชำระเงินและ API keys จัดการผ่านแดชบอร์ดเฉพาะ
            พร้อมเอกสารสำหรับนักพัฒนา
          </p>
        </div>

        <section className="landing-section">
          <h2>ทำไมต้อง MCSV Pay Gateway</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">🔗</div>
              <h3>หลายแอป หนึ่งบัญชี</h3>
              <p>
                สร้างแอปพลิเคชันย่อยได้ไม่จำกัด แต่ละแอปมี API key และ webhook แยกกัน
                เหมาะกับทีมที่มีหลายระบบ
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🔔</div>
              <h3>Webhook ที่ตรวจสอบได้</h3>
              <p>
                รับแจ้งเตือนแบบ real-time พร้อมหัว <code className="inline">X-PGW-Signature</code> สำหรับยืนยัน
                HMAC — ลดความเสี่ยงคำสั่งปลอม
              </p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">📱</div>
              <h3>PromptPay / TrueMoney</h3>
              <p>
                สร้าง QR ตามมาตรฐานสำหรับลูกค้าสแกนจ่าย ยอดโอนมีเลขทศนิยมอ้างอิงเพื่อจับคู่อัตโนมัติ
              </p>
            </div>
          </div>
        </section>

        <section className="landing-section" style={{ paddingTop: 0 }}>
          <h2>ขั้นตอนใช้งาน</h2>
          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">1</div>
              <h3>สมัครและสร้างแอป</h3>
              <p>ลงทะเบียนบัญชี merchant จากนั้นสร้างแอปพลิเคชันและเก็บ webhook secret ไว้ตรวจลายเซ็น</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">2</div>
              <h3>ออก API key</h3>
              <p>สร้างคีย์สำหรับเรียก REST API สร้างรายการชำระจาก backend ของคุณ</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">3</div>
              <h3>รับ webhook</h3>
              <p>เมื่อลูกค้าจ่ายสำเร็จ ระบบจะ POST ไป URL ที่ตั้งไว้ พร้อม payload และลายเซ็น</p>
            </div>
          </div>
        </section>

        <footer className="landing-footer">
          <p>© {new Date().getFullYear()} MCSV · Pay Gateway · สอบถามเพิ่มเติมผ่านช่องทางของ MCSV</p>
        </footer>
      </main>
    </>
  )
}
