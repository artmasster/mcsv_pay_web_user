import axios from 'axios'

const base = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL: base,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const t = localStorage.getItem('pgw_merchant_token')
  if (t) config.headers.Authorization = `Bearer ${t}`
  return config
})
