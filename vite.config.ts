import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  // Relative base => the built site works on GitHub Pages project sites
  // (user.github.io/repo/), user sites, custom domains, Netlify and Vercel
  // without any further configuration.
  base: './',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0, // keep images as real files, never inlined
  },
  server: {
    port: 5173,
    open: true,
  },
})
