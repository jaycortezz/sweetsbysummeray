import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Served from a custom domain at the root, so assets resolve from '/'.
  // (If you ever revert to the github.io/sweetsbysummeray project URL,
  //  change this back to '/sweetsbysummeray/'.)
  base: '/',
  plugins: [react()],
})
