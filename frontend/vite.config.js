import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import wasm from "vite-plugin-wasm";
import { googleAdsenseHeadPlugin } from './build/google-adsense-html.js'
import { DEFAULT_SEO } from './src/utils/seo.js'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    build: {
      outDir: './dist',
    },
    plugins: [
      vue(),
      wasm(),
      googleAdsenseHeadPlugin(env.VITE_GOOGLE_AD_CLIENT),
      AutoImport({
        imports: [
          'vue',
          {
            'naive-ui': [
              'useMessage',
              'useNotification',
              'NButton',
              'NPopconfirm',
              'NIcon',
            ]
          }
        ]
      }),
      Components({
        resolvers: [NaiveUiResolver()]
      }),
      VitePWA({
        registerType: null,
        devOptions: {
          enabled: false
        },
        workbox: {
          disableDevLogs: true,
          globPatterns: [],
          runtimeCaching: [],
          navigateFallback: null,
          cleanupOutdatedCaches: true,
        },
        manifest: {
          name: DEFAULT_SEO.title,
          short_name: DEFAULT_SEO.shortTitle,
          description: DEFAULT_SEO.description,
          theme_color: '#ffffff',
          icons: [
            {
              src: '/logo.png',
              sizes: '192x192',
              type: 'image/png'
            }
          ]
        }
      })
    ],
    resolve: {
      alias: [
        {
          find: '@',
          replacement: fileURLToPath(new URL('./src', import.meta.url))
        }
      ]
    },
    define: {
      'import.meta.env.PACKAGE_VERSION': JSON.stringify(process.env.npm_package_version),
    }
  }
})
