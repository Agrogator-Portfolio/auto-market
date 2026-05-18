<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const { user, logout } = useUser()

function onLogout() {
  logout()
  router.push('/')
}

const links = [
  { to: '/account', label: 'Мои заказы', icon: 'lucide:package' },
  { to: '/account/service', label: 'Запись в СТО', icon: 'lucide:wrench' },
  { to: '/account/garage', label: 'Мой гараж', icon: 'lucide:car' },
  { to: '/account/profile', label: 'Профиль', icon: 'lucide:user' },
]

function isActive(path: string) {
  if (path === '/account') {
    return route.path === '/account' || route.path.startsWith('/account/orders')
  }
  if (path === '/account/service') {
    return route.path.startsWith('/account/service')
  }
  return route.path.startsWith(path)
}
</script>

<template>
  <aside class="account-nav">
    <div class="account-nav__user">
      <span class="account-nav__avatar">
        <UiAppIcon name="lucide:user" :size="22" />
      </span>
      <div>
        <strong>{{ user?.fullName ?? 'Гость' }}</strong>
        <span>{{ user?.email }}</span>
      </div>
    </div>

    <nav class="account-nav__links">
      <NuxtLink
        v-for="link in links"
        :key="link.to"
        :to="link.to"
        class="account-nav__link"
        :class="{ 'account-nav__link--active': isActive(link.to) }"
      >
        <UiAppIcon :name="link.icon" :size="18" />
        {{ link.label }}
      </NuxtLink>
    </nav>

    <button type="button" class="account-nav__logout" @click="onLogout">
      <UiAppIcon name="lucide:log-out" :size="18" />
      Выйти
    </button>
  </aside>
</template>

<style scoped>
.account-nav {
  padding: 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.account-nav__user {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.account-nav__avatar {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--color-primary), #f97316);
  color: #fff;
}

.account-nav__user strong {
  display: block;
  font-size: 0.95rem;
}

.account-nav__user span {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.account-nav__links {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.account-nav__link {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.65rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text-muted);
  transition: background 0.15s, color 0.15s;
}

.account-nav__link:hover {
  background: var(--color-bg);
  color: var(--color-text);
}

.account-nav__link--active {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.account-nav__logout {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  margin-top: 1rem;
  padding: 0.65rem 0.75rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
}

.account-nav__logout:hover {
  background: #fef2f2;
  color: #dc2626;
}
</style>
