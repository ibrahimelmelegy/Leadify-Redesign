import { defineNuxtConfig } from 'nuxt/config';
import viteCompression from 'vite-plugin-compression';

export default defineNuxtConfig({
  app: {
    // pageTransition: { name: "page" , mode:"out-in" },
    head: {
      title: 'App HP Tech',
      link: [
        { rel: 'icon', href: '/images/logo-shape.png' },
        // Preload font locally instead of external request
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons', media: 'print', onload: 'this.media="all"' },
      ],
      meta: [
        { 'http-equiv': 'x-ua-compatible', content: 'IE=edge' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
      ],
    },
  },

  css: ['@/assets/styles/global.scss', 'element-plus/theme-chalk/dark/css-vars.css', '@/assets/css/premium-dark.css'],

  modules: ['@element-plus/nuxt', 'nuxt-icon', '@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxt/image', 'nuxt-tiptap-editor'],
  tiptap: {
    prefix: 'Tiptap', //prefix for Tiptap imports, composables not included
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL || '/api/',
      BASE_URL: process.env.BASE_URL || 'http://localhost:3000/',
      BUCKET_URL: process.env.BUCKET_URL || 'http://localhost:3000/',
    },
  },

  tailwindcss: {
    configPath: 'tailwind.config.js',
    cssPath: '~/assets/css/tailwind.css',
  },
  imports: {
    dirs: ['composables/**'],
  },
  ssr: false,
  devtools: { enabled: false }, // Disabled for performance in dev
  devServer: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5000'),
  },

  // Main Vite Configuration
  vite: {
    server: {
      allowedHosts: true,
      hmr: {
        overlay: false,
        protocol: 'ws',
        timeout: 10000
      },
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/.nuxt/**']
      },
      // Performance: warm-up critical files
      warmup: {
        clientFiles: ['./pages/index.vue', './pages/login.vue', './layouts/default.vue']
      }
    },
    // Plugins
    plugins: [
      viteCompression({ algorithm: 'brotliCompress' }),
      viteCompression({ algorithm: 'gzip' })
    ],
    // CSS Preprocessor
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
          additionalData: `@use "@/assets/styles/_tokens.scss" as *;`,
        },
      },
      // Reduce CSS processing time
      devSourcemap: false
    },
    // Build Optimizations
    build: {
      target: 'esnext',
      minify: 'esbuild', // Faster than terser
      cssMinify: 'esbuild',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Split EVERYTHING into smaller chunks
            if (id.includes('node_modules')) {
              if (id.includes('element-plus')) return 'element-plus';
              if (id.includes('echarts') || id.includes('vue-echarts')) return 'charts';
              if (id.includes('jspdf') || id.includes('html2pdf') || id.includes('pdf-lib')) return 'pdf';
              if (id.includes('quill') || id.includes('tiptap')) return 'editor';
              if (id.includes('vue') || id.includes('pinia')) return 'vue-core';
              if (id.includes('vue-router')) return 'vue-core';
              if (id.includes('@vueuse')) return 'vueuse';
              // All other vendors
              return 'vendor';
            }
          }
        }
      },
      chunkSizeWarningLimit: 500
    },
    // Pre-bundle ALL heavy dependencies
    optimizeDeps: {
      include: [
        'element-plus',
        'vue',
        'vue-router',
        'pinia',
        '@vueuse/core'
      ],
      exclude: [
        // Lazy load these heavy libs
        'echarts',
        'vue-echarts',
        'jspdf',
        'html2pdf.js',
        'pdf-lib',
        'quill',
        '@vueup/vue-quill'
      ]
    },
    // Reduce initial bundle size
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
    }
  },

  compatibilityDate: '2024-11-16',

  // Experimental performance features
  experimental: {
    payloadExtraction: false,  // Faster SSR
    treeshakeClientOnly: true,  // Reduce client bundle
  },

  // Build-time optimizations (Nitro)
  nitro: {
    compressPublicAssets: true,
    minify: true,
  },

  routeRules: {
    '/api/**': { proxy: 'http://localhost:3000/api/**' },
    // Cache static pages
    '/login': { prerender: true },
    '/forget-password': { prerender: true },
    '/reset-password': { prerender: true },
  },
});
