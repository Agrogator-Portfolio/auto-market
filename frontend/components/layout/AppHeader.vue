<script setup lang="ts">
const route = useRoute()
const { openLogin, openRegister } = useAuthModal()
const { isLoggedIn, isAdmin, loadFromStorage } = useUser()
const { count } = useCart()

onMounted(() => {
  loadFromStorage()
})

const isHome = computed(() => route.path === '/')

const homeNavLinks = [
  { label: 'Каталог', href: '/catalog' },
  { label: 'СТО-партнёры', href: '#sto' },
  { label: 'Новости', href: '#' },
]

const mobileOpen = ref(false)

function toggleMobile() {
  mobileOpen.value = !mobileOpen.value
}
</script>

<template>
  <header class="header">
    <div class="header__top">
      <div class="container header__top-inner">
        <span>Доставка по России · Подбор по VIN и OEM</span>
        <a href="tel:+78001234567">8 800 123-45-67</a>
      </div>
    </div>

    <div class="header__main">
      <div class="container header__main-inner">
        <NuxtLink to="/" class="header__logo" @click="mobileOpen = false">
          <span class="header__logo-icon" aria-hidden="true">AD</span>
          <span class="header__logo-text">
            <strong>АвтоДеталь</strong>
            <small>магазин запчастей</small>
          </span>
        </NuxtLink>

        <form class="header__search" role="search" @submit.prevent>
          <label class="sr-only" for="header-search">Поиск запчастей</label>
          <input
            id="header-search"
            type="search"
            placeholder="OEM, VIN, название или артикул..."
          />
          <button type="submit" class="btn btn--primary">
            <UiAppIcon name="lucide:search" :size="18" />
            Найти
          </button>
        </form>

        <nav class="header__actions" aria-label="Действия пользователя">
          <NuxtLink to="/catalog" class="header__action header__action--catalog">
            <UiAppIcon name="lucide:layout-grid" :size="20" />
            <span>Каталог</span>
          </NuxtLink>
          <NuxtLink
            v-if="isLoggedIn"
            to="/account/garage"
            class="header__action header__action--garage"
          >
            <UiAppIcon name="lucide:car" :size="20" />
            <span>Гараж</span>
          </NuxtLink>
          <button
            v-else
            type="button"
            class="header__action header__action--garage"
            @click="openLogin"
          >
            <UiAppIcon name="lucide:car" :size="20" />
            <span>Гараж</span>
          </button>
          <template v-if="isLoggedIn">
            <NuxtLink v-if="isAdmin" to="/admin/orders" class="header__action header__action--admin">
              <UiAppIcon name="lucide:shield" :size="20" />
              <span>Админка</span>
            </NuxtLink>
            <NuxtLink to="/account" class="header__action">
              <UiAppIcon name="lucide:user" :size="20" />
              <span>Кабинет</span>
            </NuxtLink>
          </template>
          <template v-else>
            <button type="button" class="header__action" @click="openLogin">
              <UiAppIcon name="lucide:user" :size="20" />
              <span>Войти</span>
            </button>
            <button type="button" class="header__action header__action--accent" @click="openRegister">
              <UiAppIcon name="lucide:user-plus" :size="20" />
              <span>Регистрация</span>
            </button>
          </template>
          <NuxtLink to="/cart" class="header__action header__cart">
            <UiAppIcon name="lucide:shopping-cart" :size="20" />
            <span>Корзина</span>
            <span v-if="count > 0" class="header__cart-badge">{{ count > 99 ? '99+' : count }}</span>
          </NuxtLink>
        </nav>

        <button
          type="button"
          class="header__burger"
          :aria-expanded="mobileOpen"
          aria-label="Меню"
          @click="toggleMobile"
        >
          <span />
          <span />
          <span />
        </button>
      </div>
    </div>

    <nav
      v-if="isHome"
      class="header__nav"
      :class="{ 'header__nav--open': mobileOpen }"
    >
      <div class="container header__nav-inner">
        <NuxtLink
          v-for="link in homeNavLinks"
          :key="link.href"
          :to="link.href"
          class="header__nav-link"
          @click="mobileOpen = false"
        >
          {{ link.label }}
        </NuxtLink>
      </div>
    </nav>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--color-surface);
  box-shadow: var(--shadow-sm);
}

.header__top {
  background: var(--color-accent);
  color: #fff;
  font-size: 0.8rem;
}

.header__top-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-block: 0.45rem;
  gap: 1rem;
}

.header__top a {
  color: #fff;
  font-weight: 600;
}

.header__main-inner {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1.25rem;
  min-height: var(--header-h);
  padding-block: 0.75rem;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.header__logo-icon {
  display: grid;
  place-items: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--color-primary), #f48c06);
  color: #fff;
  font-weight: 800;
  font-size: 0.85rem;
}

.header__logo-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.header__logo-text strong {
  font-size: 1.05rem;
}

.header__logo-text small {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.header__search {
  display: flex;
  gap: 0.5rem;
  max-width: 520px;
  width: 100%;
  margin-inline: auto;
}

.header__search input {
  flex: 1;
  padding: 0.65rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
}

.header__search input:focus {
  outline: 2px solid var(--color-primary-soft);
  border-color: var(--color-primary);
}

.header__actions {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.header__action {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.5rem 0.75rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  color: var(--color-text);
}

.header__action:hover {
  background: var(--color-surface-muted);
}

.header__action--accent {
  color: var(--color-primary);
}

.header__action--catalog {
  color: var(--color-accent);
}

.header__action--catalog:hover {
  background: var(--color-primary-soft);
  color: var(--color-accent);
}

.header__action--garage:hover {
  background: #ecfdf5;
  color: #047857;
}

.header__cart {
  position: relative;
}

.header__cart-badge {
  position: absolute;
  top: 0;
  right: 0;
  min-width: 18px;
  height: 18px;
  padding: 0 4px;
  border-radius: 999px;
  background: var(--color-primary);
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  display: grid;
  place-items: center;
}

.header__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  padding: 0.5rem;
  border: none;
  background: transparent;
  cursor: pointer;
}

.header__burger span {
  display: block;
  width: 22px;
  height: 2px;
  background: var(--color-text);
  border-radius: 2px;
}

.header__nav {
  border-top: 1px solid var(--color-border);
  background: var(--color-surface-muted);
}

.header__nav-inner {
  display: flex;
  gap: 0.25rem;
  padding-block: 0.35rem;
  overflow-x: auto;
}

.header__nav-link {
  padding: 0.5rem 0.9rem;
  border-radius: var(--radius-sm);
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  color: var(--color-text-muted);
}

.header__nav-link:hover {
  color: var(--color-accent);
  background: var(--color-surface);
}

@media (max-width: 1024px) {
  .header__search {
    display: none;
  }

  .header__action span:not(.header__cart-badge) {
    display: none;
  }
}

@media (max-width: 768px) {
  .header__top {
    display: none;
  }

  .header__burger {
    display: flex;
  }

  .header__actions .header__action:not(.header__cart):not(.header__action--catalog):not(.header__action--garage) {
    display: none;
  }

  .header__nav {
    display: none;
  }

  .header__nav--open {
    display: block;
  }
}
</style>
