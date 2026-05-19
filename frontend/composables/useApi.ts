export class ApiError extends Error {
  status: number
  data: unknown

  constructor(message: string, status: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const TOKEN_KEY = 'autodetail-token'

function isNetworkError(e: { message?: string; cause?: unknown }): boolean {
  const msg = String(e.message ?? '').toLowerCase()
  if (msg.includes('failed to fetch') || msg.includes('network') || msg.includes('load failed')) {
    return true
  }
  const cause = e.cause as { code?: string } | undefined
  return cause?.code === 'ECONNREFUSED' || cause?.code === 'ENOTFOUND'
}

export function useApi() {
  const token = useState<string | null>('auth-token', () => null)

  function loadToken() {
    if (!import.meta.client) return
    token.value = localStorage.getItem(TOKEN_KEY)
  }

  function setToken(value: string | null) {
    token.value = value
    if (import.meta.client) {
      if (value) localStorage.setItem(TOKEN_KEY, value)
      else localStorage.removeItem(TOKEN_KEY)
    }
  }

  async function apiFetch<T>(
    path: string,
    options: {
      method?: 'GET' | 'POST' | 'PATCH' | 'DELETE'
      body?: unknown
      query?: Record<string, string | number | boolean | undefined>
      auth?: boolean
    } = {},
  ): Promise<T> {
    const base = resolveApiBase()
    const url = new URL(`${base}${path.startsWith('/') ? path : `/${path}`}`)

    if (options.query) {
      for (const [key, val] of Object.entries(options.query)) {
        if (val !== undefined && val !== '' && val !== false) {
          url.searchParams.set(key, String(val))
        }
      }
    }

    const headers: Record<string, string> = {
      Accept: 'application/json',
    }

    if (options.body !== undefined) {
      headers['Content-Type'] = 'application/json'
    }

    const needsAuth = options.auth !== false && token.value
    if (needsAuth && token.value) {
      headers.Authorization = `Bearer ${token.value}`
    }

    try {
      return await $fetch<T>(url.toString(), {
        method: options.method ?? 'GET',
        body: options.body as BodyInit | Record<string, unknown> | undefined,
        headers,
      })
    } catch (err: unknown) {
      const e = err as {
        statusCode?: number
        status?: number
        data?: { message?: string | string[] }
        response?: { status?: number; _data?: { message?: string | string[] } }
        message?: string
      }
      const status = e.statusCode ?? e.status ?? e.response?.status ?? 500
      const body = e.data ?? e.response?._data
      const rawMessage = body?.message
      const msg = Array.isArray(rawMessage)
        ? rawMessage.join(', ')
        : typeof rawMessage === 'string'
          ? rawMessage
          : status === 401
            ? 'Неверный логин или пароль'
            : isNetworkError(e)
              ? 'Нет связи с сервером. Проверьте, что API доступен и NUXT_PUBLIC_API_BASE указывает на ваш домен (например /backend-api).'
              : e.message && !String(e.message).toLowerCase().includes('fetch')
                ? e.message
                : 'Ошибка сервера'
      throw new ApiError(msg, status, body ?? e)
    }
  }

  if (import.meta.client && !token.value) {
    loadToken()
  }

  return {
    apiFetch,
    token,
    setToken,
    loadToken,
  }
}
