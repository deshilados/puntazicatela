import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  base: './',
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],
      manifest: {
        name: 'Deshilados PXM',
        short_name: 'Deshilados',
        description: 'Catálogo de prendas típicas de Oaxaca - Punta Zicatela (Deshilados PXM)',
        theme_color: '#4a6741',
        background_color: '#ffffff',
        display: 'standalone',
        lang: 'es',
        start_url: './',
        scope: './',
        icons: [
          { src: 'favicon.ico', sizes: '64x64 32x32 16x16', type: 'image/x-icon' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    host: true, // Permite acceso desde la red local
    open: true, // Abre el navegador automáticamente
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        format: 'es',
        entryFileNames: `app.js`,
        chunkFileNames: `app-[hash].js`,
        assetFileNames: `app.[ext]`,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})