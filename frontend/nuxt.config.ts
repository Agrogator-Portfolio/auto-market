export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    /** SSR / Docker: http://backend:3001/api — задаётся через NUXT_API_BASE */
    apiBase: process.env.NUXT_API_BASE || process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    public: {
      /** Браузер: http://localhost:3001/api */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001/api',
    },
  },
  app: {
    head: {
      title: 'АвтоДеталь — магазин автозапчастей',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Онлайн-магазин автозапчастей: подбор по VIN и OEM, доставка по России',
        },
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap',
        },
      ],
    },
  },
})
