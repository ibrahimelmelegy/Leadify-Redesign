import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  app: {
    // pageTransition: { name: "page" , mode:"out-in" },
    head: {
      title: 'App HP Tech',
      link: [
        { rel: 'icon', href: '/images/logo-shape.png' },
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/icon?family=Material+Icons' },
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
  devtools: { enabled: true, vscode: { enabled: true } },
  devServer: {
    host: '0.0.0.0',
    port: parseInt(process.env.PORT || '5000'),
  },
  vite: {
    server: {
      allowedHosts: true,
      // hmr: false, // Re-enabling HMR might help if the issue was polling related
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/assets/styles/_tokens.scss" as *;`,
        },
      },
    },
  },

  // pwa: {
  //   workbox: {
  //     runtimeCaching: [
  //       {
  //         urlPattern: '.*', // Match all requests
  //         handler: 'NetworkFirst', // Fallback to network
  //       },
  //     ],
  //   },
  // },

  compatibilityDate: '2024-11-16',
  routeRules: {
    '/api/**': { proxy: 'http://localhost:3000/api/**' },
  },
});
