import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { LandingPage } from './pages/LandingPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { DashboardPage } from './pages/DashboardPage'
import { AppDetailPage } from './pages/AppDetailPage'
import { PaymentsPage } from './pages/PaymentsPage'
import { PaymentDetailPage } from './pages/PaymentDetailPage'

function Private({ children }: { children: React.ReactNode }) {
  const t = localStorage.getItem('pgw_merchant_token')
  if (!t) return <Navigate to="/login" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <Private>
              <Layout />
            </Private>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="apps/:id" element={<AppDetailPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="payments/:paymentId" element={<PaymentDetailPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
