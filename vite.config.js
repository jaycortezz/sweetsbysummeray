import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // served from https://jaycortezz.github.io/sweetsbysummeray/
  base: '/sweetsbysummeray/',
  plugins: [react()],
})
