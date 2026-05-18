export default defineNuxtRouteMiddleware(async () => {
  const { user, hydrated, fetchMe } = useUser()

  if (!hydrated.value) {
    await fetchMe()
  }

  if (!user.value) {
    return navigateTo({ path: '/', query: { auth: 'required' } })
  }

  if (user.value.role !== 'admin') {
    return navigateTo('/')
  }
})
