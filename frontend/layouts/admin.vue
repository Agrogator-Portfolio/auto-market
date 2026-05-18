<script setup lang="ts">
const route = useRoute()

const nav = [
  { to: '/admin/orders', label: 'Заказы', icon: 'lucide:clipboard-list', desc: 'Обработка и статусы' },
  { to: '/admin/service-requests', label: 'Запись в СТО', icon: 'lucide:wrench', desc: 'Обращения клиентов' },
  { to: '/admin/auto-services', label: 'Автосервисы', icon: 'lucide:building-2', desc: 'СТО и виды работ' },
  { to: '/admin/users', label: 'Пользователи', icon: 'lucide:users', desc: 'Клиенты и история' },
  { to: '/admin/products', label: 'Товары', icon: 'lucide:package', desc: 'Каталог и атрибуты' },
]
</script>

<template>
  <div class="admin-shell">
    <aside class="admin-sidebar">
      <NuxtLink to="/admin/orders" class="admin-sidebar__brand">
        <span class="admin-sidebar__logo">AD</span>
        <span>
          <strong>АвтоДеталь</strong>
          <small>Панель менеджера</small>
        </span>
      </NuxtLink>

      <p class="admin-sidebar__label">Разделы</p>
      <nav class="admin-sidebar__nav">
        <NuxtLink
          v-for="item in nav"
          :key="item.to"
          :to="item.to"
          class="admin-sidebar__link"
          :class="{ 'admin-sidebar__link--active': route.path.startsWith(item.to) }"
        >
          <UiAppIcon :name="item.icon" :size="20" />
          <span>
            {{ item.label }}
            <small>{{ item.desc }}</small>
          </span>
        </NuxtLink>
      </nav>

      <div class="admin-sidebar__footer">
        <NuxtLink to="/" class="admin-sidebar__back">
          <UiAppIcon name="lucide:store" :size="16" />
          Вернуться в магазин
        </NuxtLink>
      </div>
    </aside>

    <main class="admin-main">
      <slot />
    </main>
    <UiAppToast />
  </div>
</template>

<style>
@import '~/assets/css/admin.css';

.admin-sidebar__link span {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
  line-height: 1.25;
}

.admin-sidebar__link small {
  font-size: 0.68rem;
  font-weight: 500;
  color: #64748b;
}

.admin-sidebar__link--active small {
  color: #94a3b8;
}
</style>
