import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the site from /<repo-name>/ (set by the deploy workflow).
  base: process.env.VITE_BASE ?? '/',
})
