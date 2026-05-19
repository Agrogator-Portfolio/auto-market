/**
 * Базовый URL API.
 * - SSR: NUXT_API_BASE (в Docker: http://backend:3001/api)
 * - Браузер: NUXT_PUBLIC_API_BASE (на сервере: /backend-api через Nitro proxy)
 */
export function resolveApiBase(): string {
  const config = useRuntimeConfig()

  if (import.meta.server) {
    return String(config.apiBase).replace(/\/$/, '')
  }

  const publicPath = String(config.public.apiBase ?? '/backend-api').trim()

  if (publicPath.startsWith('/')) {
    return `${window.location.origin}${publicPath}`.replace(/\/$/, '')
  }

  try {
    const parsed = new URL(publicPath)
    const localHost = parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1'
    const localSite =
      window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'

    if (localHost && !localSite) {
      return `${window.location.origin}/backend-api`.replace(/\/$/, '')
    }
  } catch {
    return `${window.location.origin}/backend-api`.replace(/\/$/, '')
  }

  return publicPath.replace(/\/$/, '')
}
