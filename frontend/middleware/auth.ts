export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) return

  const { isLoggedIn, hydrated, loadFromStorage } = useUser()

  if (!hydrated.value) {
    await loadFromStorage()
  }

  if (!isLoggedIn.value) {
    return navigateTo({ path: '/', query: { auth: 'required' } })
  }
})
