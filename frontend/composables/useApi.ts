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

export function useApi() {
  const config = useRuntimeConfig()
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
    const base = (import.meta.server ? config.apiBase : config.public.apiBase) as string
    const url = new URL(`${base.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`)

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
