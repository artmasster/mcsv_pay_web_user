import axios from 'axios'
import { apiBaseUrl } from '@/config/pgw'

export const api = axios.create({
  baseURL: apiBaseUrl(),
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const rel = `${config.baseURL ?? ''}${config.url ?? ''}`
  let path = rel
  if (typeof window !== 'undefined' && rel.startsWith('http')) {
    try {
      path = new URL(rel).pathname + new URL(rel).search
    } catch {
      path = rel
    }
  }
  if (
    path.includes('/auth/login') ||
    path.includes('/auth/register') ||
    path.includes('/auth/2fa/verify')
  ) {
    return config
  }
  const t = localStorage.getItem('pgw_merchant_token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})
