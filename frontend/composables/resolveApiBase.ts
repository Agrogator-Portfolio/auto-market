/**
 * Базовый URL API.
 * - SSR: NUXT_API_BASE (внутренний адрес бэкенда, напр. http://backend:3001/api)
 * - Браузер: NUXT_PUBLIC_API_BASE (обычно /api через nginx) или полный URL домена
 * Если в сборке остался localhost, а сайт на другом домене — подставляем same-origin /api.
 */
export function resolveApiBase(): string {
  const config = useRuntimeConfig()

  if (import.meta.server) {
    return String(config.apiBase).replace(/\/$/, '')
  }

  let base = String(config.public.apiBase ?? '/api').trim()

  if (base.startsWith('/')) {
    return `${window.location.origin}${base}`.replace(/\/$/, '')
  }

  try {
    const parsed = new URL(base)
    const localHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    const localSite =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    if (localHost && !localSite) {
      return `${window.location.origin}/api`.replace(/\/$/, '')
    }
  } catch {
    return `${window.location.origin}/api`.replace(/\/$/, '')
  }

  return base.replace(/\/$/, '')
}
