import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
        manifest: {
          name: 'World Monitor & Home Control',
          short_name: 'WorldMonitor',
          description: 'Real-time world monitoring and home control dashboard',
          theme_color: '#09090b',
          background_color: '#09090b',
          display: 'standalone',
          orientation: 'any',
          icons: [
            { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
            { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          runtimeCaching: [
            {
              urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
              handler: 'CacheFirst',
              options: { cacheName: 'google-fonts', expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 } }
            }
          ]
        }
      })
    ],
    server: {
      proxy: {
        '/api/news': {
          target: 'https://newsapi.org',
          changeOrigin: true,
          rewrite: (path) => {
            const separator = path.includes('?') ? '&' : '?';
            const newPath = `/v2${path.replace('/api/news', '')}${separator}apiKey=${env.NEWS_API_KEY}`;
            return newPath;
          }
        },
        '/api/stocks': {
          target: 'https://finnhub.io',
          changeOrigin: true,
          rewrite: (path) => {
            const separator = path.includes('?') ? '&' : '?';
            const newPath = `/api/v1${path.replace('/api/stocks', '')}${separator}token=${env.FINNHUB_API_KEY}`;
            return newPath;
          }
        },
        '/api/gemini': {
          target: 'https://generativelanguage.googleapis.com',
          changeOrigin: true,
          rewrite: (path) => path.replace('/api/gemini', '')
        },
        '/api/firms': {
          target: 'https://firms.modaps.eosdis.nasa.gov',
          changeOrigin: true,
          rewrite: (path) => {
            const cleanPath = path.replace('/api/firms', '');
            return `/api/area/csv/${env.FIRMS_API_KEY}${cleanPath}`;
          }
        },
        '/api/pizzint': {
          target: 'https://www.pizzint.watch',
          changeOrigin: true,
          rewrite: (path) => path.replace('/api/pizzint', '')
        }
      }
    }
  }
})
