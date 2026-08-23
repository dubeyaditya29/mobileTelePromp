import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// App lives at the DOMAIN ROOT.
// Deploy to: https://dubeyaditya29.github.io/  (not /mobileTelePromp/)
const base = '/'

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'ScrollTake',
        short_name: 'ScrollTake',
        description:
          'Record talking-head videos with a scrolling teleprompter script — right in your browser.',
        theme_color: '#2a1a12',
        background_color: '#1f120c',
        display: 'standalone',
        orientation: 'any',
        start_url: '/',
        scope: '/',
        lang: 'en',
        categories: ['productivity', 'video'],
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,txt}'],
      },
      devOptions: {
        enabled: false,
      },
    }),
  ],
})
