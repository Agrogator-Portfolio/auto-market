export type AuthModalMode = 'login' | 'register' | null

export function useAuthModal() {
  const mode = useState<AuthModalMode>('auth-modal-mode', () => null)

  const isOpen = computed(() => mode.value !== null)

  function openLogin() {
    mode.value = 'login'
  }

  function openRegister() {
    mode.value = 'register'
  }

  function close() {
    mode.value = null
  }

  watch(isOpen, (open) => {
    if (import.meta.client) {
      document.body.style.overflow = open ? 'hidden' : ''
    }
  })

  function switchToLogin() {
    mode.value = 'login'
  }

  function switchToRegister() {
    mode.value = 'register'
  }

  return {
    mode,
    isOpen,
    openLogin,
    openRegister,
    close,
    switchToLogin,
    switchToRegister,
  }
}
