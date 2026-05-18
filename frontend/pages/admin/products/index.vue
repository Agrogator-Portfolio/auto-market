<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'
import { formatPrice, getCategoryBySlug } from '~/data/catalog'

definePageMeta({ layout: 'admin', middleware: 'admin' })

const { listProducts, deleteProduct } = useAdmin()
const { show } = useToast()
const products = ref<CatalogProduct[]>([])
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    products.value = await listProducts()
  } finally {
    loading.value = false
  }
}

async function remove(id: number) {
  if (!confirm('Удалить товар?')) return
  try {
    await deleteProduct(id)
    show('Товар удалён', 'success')
    await load()
  } catch {
    show('Ошибка удаления', 'error')
  }
}

onMounted(load)
useHead({ title: 'Товары — Админка' })
</script>

<template>
  <div class="admin-page">
    <header class="admin-page__head">
      <h1>Товары</h1>
      <NuxtLink to="/admin/products/new" class="btn btn--primary">Добавить товар</NuxtLink>
    </header>

    <div v-if="loading" class="admin-page__muted">Загрузка…</div>

    <table v-else class="admin-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Категория</th>
          <th>Цена</th>
          <th>Наличие</th>
          <th />
        </tr>
      </thead>
      <tbody>
        <tr v-for="p in products" :key="p.id">
          <td>
            <strong>{{ p.name }}</strong>
            <small class="admin-table__sub">{{ p.brand }} · {{ p.sku }}</small>
          </td>
          <td>{{ getCategoryBySlug(p.categorySlug)?.name }}</td>
          <td>{{ formatPrice(p.price) }}</td>
          <td>{{ p.inStock ? 'Да' : 'Под заказ' }}</td>
          <td class="admin-table__actions">
            <NuxtLink :to="`/admin/products/${p.id}`" class="btn btn--outline btn--sm">
              Изменить
            </NuxtLink>
            <button type="button" class="btn btn--outline btn--sm" @click="remove(p.id)">
              Удалить
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.admin-page__head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.admin-page h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 800;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  overflow: hidden;
  font-size: 0.9rem;
}

.admin-table th,
.admin-table td {
  padding: 0.65rem 0.85rem;
  border-bottom: 1px solid var(--color-border);
  text-align: left;
}

.admin-table th {
  background: var(--color-bg);
  font-size: 0.78rem;
  color: var(--color-text-muted);
}

.admin-table__sub {
  display: block;
  color: var(--color-text-muted);
  font-weight: 500;
}

.admin-table__actions {
  display: flex;
  gap: 0.35rem;
}

.admin-page__muted {
  color: var(--color-text-muted);
}
</style>
