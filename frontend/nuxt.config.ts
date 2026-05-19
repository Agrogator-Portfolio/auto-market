const apiProxyTarget = (process.env.NUXT_API_PROXY_TARGET || 'http://127.0.0.1:3001').replace(
  /\/$/,
  '',
)

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon'],
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    /** SSR: прямой доступ к NestJS (Docker: http://backend:3001/api) */
    apiBase: process.env.NUXT_API_BASE || `${apiProxyTarget}/api`,
    public: {
      /** Браузер: относительный /api (nginx) или полный URL https://ваш-домен/api */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '/api',
    },
  },
  nitro: {
    /** Прокси /api → бэкенд (если nginx не проксирует сам) */
    routeRules: {
      '/api/**': {
        proxy: `${apiProxyTarget}/api/**`,
      },
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
