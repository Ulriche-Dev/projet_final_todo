import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/taches': 'http://127.0.0.1:8000',
      '/check-report-status': 'http://127.0.0.1:8000',
    },
  },
})
