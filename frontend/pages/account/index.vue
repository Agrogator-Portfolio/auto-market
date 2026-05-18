<script setup lang="ts">
import type { OrderStatus } from '~/data/orders'
import { orderStatusFilters } from '~/data/orders'

definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { fetchOrders, filterByStatus, loaded } = useOrders()

useHead({ title: 'Мои заказы — АвтоДеталь' })

const statusFilter = computed<OrderStatus | 'all'>(() => {
  const q = String(route.query.status ?? 'all')
  return orderStatusFilters.some((f) => f.value === q) ? (q as OrderStatus | 'all') : 'all'
})

const searchQuery = ref(String(route.query.q ?? ''))

watch(statusFilter, (status) => {
  fetchOrders(status)
}, { immediate: true })

const filteredOrders = computed(() => {
  let list = filterByStatus(statusFilter.value)
  const q = searchQuery.value.trim().toLowerCase()
  if (q) {
    list = list.filter(
      (o) =>
        o.number.toLowerCase().includes(q)
        || o.items.some((i) => i.name.toLowerCase().includes(q)),
    )
  }
  return list
})

function setStatus(status: OrderStatus | 'all') {
  navigateTo({ path: '/account', query: { ...route.query, status: status === 'all' ? undefined : status } })
}
</script>

<template>
  <div class="account-page">
    <div class="container account-page__layout">
      <AccountNav />

      <div class="account-page__content">
        <header class="account-page__header">
          <h1>Мои заказы</h1>
          <p>История покупок и текущие статусы</p>
        </header>

        <div class="account-filters">
          <div class="account-filters__status">
            <button
              v-for="f in orderStatusFilters"
              :key="f.value"
              type="button"
              class="account-filters__pill"
              :class="{ 'account-filters__pill--active': statusFilter === f.value }"
              @click="setStatus(f.value)"
            >
              {{ f.label }}
            </button>
          </div>
          <label class="account-filters__search">
            <UiAppIcon name="lucide:search" :size="18" />
            <input
              v-model="searchQuery"
              type="search"
              placeholder="Номер заказа или название товара..."
            />
          </label>
        </div>

        <div v-if="!loaded" class="account-empty">
          <p>Загрузка заказов…</p>
        </div>

        <div v-else-if="filteredOrders.length" class="account-orders">
          <AccountOrderCard
            v-for="order in filteredOrders"
            :key="order.id"
            :order="order"
          />
        </div>

        <div v-else class="account-empty">
          <UiAppIcon name="lucide:package-x" :size="48" />
          <h2>Заказов не найдено</h2>
          <p>Попробуйте изменить фильтр или оформите новый заказ в каталоге</p>
          <NuxtLink to="/catalog" class="btn btn--primary">В каталог</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.account-page {
  padding-block: 2rem 3rem;
}

.account-page__layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  gap: 1.75rem;
  align-items: start;
}

.account-page__header h1 {
  margin: 0 0 0.35rem;
  font-size: 1.75rem;
  font-weight: 800;
}

.account-page__header p {
  margin: 0 0 1.5rem;
  color: var(--color-text-muted);
}

.account-filters {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.account-filters__status {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.account-filters__pill {
  padding: 0.45rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-surface);
  font: inherit;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
}

.account-filters__pill--active {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.account-filters__search {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 0.85rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
}

.account-filters__search input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
}

.account-orders {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.account-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 900px) {
  .account-page__layout {
    grid-template-columns: 1fr;
  }
}
</style>
