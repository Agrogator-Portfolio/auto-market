import type { AuthResponse, AuthUser } from '~/types/api'

const USER_KEY = 'autodetail-user'

export type { AuthUser }

export function useUser() {
  const user = useState<AuthUser | null>('auth-user', () => null)
  const hydrated = useState('auth-user-hydrated', () => false)
  const { apiFetch, setToken, loadToken, token } = useApi()

  function saveUserLocally(value: AuthUser | null) {
    user.value = value
    if (import.meta.client) {
      if (value) localStorage.setItem(USER_KEY, JSON.stringify(value))
      else localStorage.removeItem(USER_KEY)
    }
  }

  function applyAuthResponse(res: AuthResponse) {
    setToken(res.accessToken)
    saveUserLocally(res.user)
    return res.user
  }

  async function fetchMe() {
    if (!token.value) {
      loadToken()
    }
    if (!token.value) {
      saveUserLocally(null)
      hydrated.value = true
      return null
    }

    try {
      const me = await apiFetch<AuthUser>('/auth/me', { auth: true })
      saveUserLocally(me)
      return me
    } catch {
      setToken(null)
      saveUserLocally(null)
      return null
    } finally {
      hydrated.value = true
    }
  }

  async function loadFromStorage() {
    if (!import.meta.client) return
    loadToken()
    try {
      const raw = localStorage.getItem(USER_KEY)
      if (raw) user.value = JSON.parse(raw) as AuthUser
    } catch {
      user.value = null
    }
    await fetchMe()
  }

  async function register(data: {
    fullName: string
    email: string
    phone: string
    password: string
    birthDate?: string
  }) {
    const res = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      body: data,
      auth: false,
    })
    return applyAuthResponse(res)
  }

  async function login(data: { email: string; password: string }) {
    const res = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      body: data,
      auth: false,
    })
    return applyAuthResponse(res)
  }

  function logout() {
    setToken(null)
    saveUserLocally(null)
    const vehicles = useState<unknown[]>('garage-vehicles')
    const garageLoaded = useState('garage-loaded')
    vehicles.value = []
    garageLoaded.value = false
  }

  const isLoggedIn = computed(() => Boolean(user.value && token.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  async function updateProfile(data: {
    fullName?: string
    email?: string
    phone?: string
    birthDate?: string
  }) {
    const updated = await apiFetch<AuthUser>('/users/profile', {
      method: 'PATCH',
      body: data,
    })
    saveUserLocally(updated)
    return updated
  }

  if (import.meta.client && !hydrated.value) {
    loadFromStorage()
  }

  return {
    user,
    isLoggedIn,
    hydrated,
    register,
    login,
    logout,
    loadFromStorage,
    fetchMe,
    isAdmin,
    updateProfile,
  }
}
