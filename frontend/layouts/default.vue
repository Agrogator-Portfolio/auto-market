<script setup lang="ts">
import AuthModal from '~/components/auth/AuthModal.vue'

const route = useRoute()
const { openLogin } = useAuthModal()
const { loadFromStorage } = useUser()

onMounted(() => {
  loadFromStorage()
  if (route.query.auth === 'required') {
    openLogin()
  }
})
</script>

<template>
  <div class="layout">
    <LayoutAppHeader />
    <main class="layout__main">
      <slot />
    </main>
    <LayoutAppFooter />
    <AuthModal />
    <UiAppToast />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout__main {
  flex: 1;
}
</style>
