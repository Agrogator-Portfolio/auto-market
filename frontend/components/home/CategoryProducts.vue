<script setup lang="ts">
import type { CategorySlug } from '~/data/catalog'
import { catalogCategories } from '~/data/catalog'
import type { CatalogListResponse } from '~/types/api'

const { apiFetch } = useApi()
const activeSlug = ref<CategorySlug>(catalogCategories[0]?.slug ?? 'engine')

const activeCategory = computed(
  () => catalogCategories.find((c) => c.slug === activeSlug.value) ?? catalogCategories[0],
)

const categoryItems = ref<CatalogListResponse['items']>([])
const loading = ref(true)

async function loadCategoryProducts() {
  loading.value = true
  try {
    const data = await apiFetch<CatalogListResponse>('/catalog/products', {
      query: { category: activeSlug.value, page: 1, pageSize: 6 },
      auth: false,
    })
    categoryItems.value = (data.items ?? []).slice(0, 6)
  } catch {
    categoryItems.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCategoryProducts()
})

watch(activeSlug, () => {
  loadCategoryProducts()
})

const activeProducts = computed(() => categoryItems.value)
</script>

<template>
  <section id="categories" class="section categories">
    <div class="container">
      <div class="section__header">
        <div>
          <h2 class="section__title">Товары по категориям</h2>
          <p class="section__subtitle">
            Двигатель, тормоза, подвеска, электрика и другие разделы каталога
          </p>
        </div>
      </div>

      <div class="categories__tabs" role="tablist">
        <button
          v-for="cat in catalogCategories"
          :key="cat.slug"
          type="button"
          role="tab"
          class="categories__tab"
          :class="{ 'categories__tab--active': activeSlug === cat.slug }"
          :aria-selected="activeSlug === cat.slug"
          @click="activeSlug = cat.slug"
        >
          <UiAppIcon :name="cat.icon" :size="18" />
          {{ cat.name }}
        </button>
      </div>

      <div v-if="activeCategory" class="categories__panel" role="tabpanel">
        <p v-if="loading" class="categories__empty">Загрузка товаров…</p>
        <div v-else-if="activeProducts.length" class="categories__grid">
          <ProductCard
            v-for="product in activeProducts"
            :key="product.id"
            :product="product"
          />
        </div>
        <p v-else class="categories__empty">В этой категории пока нет товаров</p>
        <div v-if="!loading && activeProducts.length" class="categories__footer">
          <NuxtLink :to="{ path: '/catalog', query: { category: activeCategory.slug } }" class="btn btn--outline">
            Все товары: {{ activeCategory.name }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.categories {
  background: var(--color-surface);
}

.categories__tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.75rem;
}

.categories__tab {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1rem;
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg);
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.categories__tab:hover {
  border-color: var(--color-accent);
}

.categories__tab--active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
}

.categories__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.categories__empty {
  margin: 0 0 1rem;
  padding: 2rem;
  text-align: center;
  color: var(--color-text-muted);
  background: var(--color-bg);
  border-radius: var(--radius-md);
}

.categories__footer {
  display: flex;
  justify-content: center;
  margin-top: 1.75rem;
}

@media (max-width: 1100px) {
  .categories__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .categories__grid {
    grid-template-columns: 1fr;
  }
}
</style>
