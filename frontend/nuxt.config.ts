export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  routeRules: {
    '/backend-api/**': {
      proxy: `${process.env.NUXT_API_PROXY_TARGET || 'http://backend:3001/api'}/**`,
    },
  },
  runtimeConfig: {
    apiBase: process.env.NUXT_API_BASE || 'http://backend:3001/api',
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/backend-api',
    },
  },
  app: {
    head: {
      title: 'АвтоДеталь - магазин автозапчастей',
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
