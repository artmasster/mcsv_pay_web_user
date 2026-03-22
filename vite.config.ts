import path from 'node:path'
import { fileURLToPath } from 'node:url'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const dir = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { '@': path.join(dir, 'src') },
  },
  server: {
    proxy: {
      '/api': 'http://127.0.0.1:4002',
      '/v1': 'http://127.0.0.1:4002',
      '/webhooks': 'http://127.0.0.1:4002',
      '/health': 'http://127.0.0.1:4002',
    },
  },
})
