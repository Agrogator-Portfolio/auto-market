<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'

const HOME_PRODUCTS_LIMIT = 6

const { apiFetch } = useApi()

const popularProducts = ref<CatalogProduct[]>([])
const loading = ref(true)

async function loadPopular() {
  loading.value = true
  try {
    const data = await apiFetch<CatalogProduct[]>('/catalog/popular', {
      query: { limit: HOME_PRODUCTS_LIMIT },
      auth: false,
    })
    popularProducts.value = Array.isArray(data) ? data.slice(0, HOME_PRODUCTS_LIMIT) : []
  } catch {
    popularProducts.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadPopular()
})
</script>

<template>
  <section id="popular" class="section popular">
    <div class="container">
      <div class="section__header">
        <div>
          <h2 class="section__title">Популярные товары</h2>
          <p class="section__subtitle">Хиты продаж и часто заказываемые позиции</p>
        </div>
        <NuxtLink to="/catalog" class="btn btn--outline">
          Весь каталог
          <UiAppIcon name="lucide:arrow-right" :size="18" />
        </NuxtLink>
      </div>

      <p v-if="loading" class="popular__state">Загрузка товаров…</p>
      <div v-else-if="popularProducts.length" class="popular__grid">
        <ProductCard
          v-for="product in popularProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      <p v-else class="popular__state">Товары временно недоступны. Проверьте, что запущен сервер API.</p>
    </div>
  </section>
</template>

<style scoped>
.popular__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.popular__state {
  margin: 0;
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

@media (max-width: 1100px) {
  .popular__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .popular__grid {
    grid-template-columns: 1fr;
  }
}
</style>
