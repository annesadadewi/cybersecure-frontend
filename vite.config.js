import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true, // Ini bakal maksa Vite error kalau 5173 dipake, bukannya malah pindah port
  }
})
