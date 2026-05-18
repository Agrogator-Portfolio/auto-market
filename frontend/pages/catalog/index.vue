<script setup lang="ts">
import type { CategorySlug } from '~/data/catalog'
import { catalogCategories } from '~/data/catalog'

const route = useRoute()
const router = useRouter()

const defaultSlug: CategorySlug = 'engine'

const categorySlug = computed<CategorySlug>(() => {
  const q = String(route.query.category ?? '')
  const fromQuery = catalogCategories.find((c) => c.slug === q)?.slug
  return fromQuery ?? defaultSlug
})

function setCategory(slug: string) {
  router.replace({ path: '/catalog', query: { category: slug } })
}

const categorySlugRef = computed(() => categorySlug.value)

const garageFit = ref(false)
const garageVehicleId = ref('')
const garageFilter = computed(() => ({
  enabled: garageFit.value,
  vehicleId: garageVehicleId.value,
}))

const {
  category,
  search,
  sort,
  page,
  filterValues,
  paginatedList,
  totalPages,
  totalCount,
  resetFilters,
  setPage,
} = useCatalogList(categorySlugRef, garageFilter)

onMounted(() => {
  const qVehicle = String(route.query.garageVehicleId ?? '')
  if (qVehicle) {
    garageVehicleId.value = qVehicle
    garageFit.value = true
  }
})

useHead(() => ({
  title: category.value ? `${category.value.name} — Каталог` : 'Каталог — АвтоДеталь',
}))

const mobileSidebarOpen = ref(false)

watch(categorySlug, () => {
  mobileSidebarOpen.value = false
})
</script>

<template>
  <div v-if="category" class="catalog-page">
    <div class="container catalog-page__head">
      <nav class="catalog-page__breadcrumbs">
        <NuxtLink to="/">Главная</NuxtLink>
        <span>/</span>
        <span>Каталог</span>
        <span>/</span>
        <span>{{ category.name }}</span>
      </nav>
      <div class="catalog-page__title-row">
        <div>
          <h1 class="catalog-page__title">Каталог автозапчастей</h1>
          <p class="catalog-page__desc">{{ category.description }}</p>
        </div>
        <button
          type="button"
          class="btn btn--outline catalog-page__sidebar-toggle"
          @click="mobileSidebarOpen = !mobileSidebarOpen"
        >
          <UiAppIcon name="lucide:sliders-horizontal" :size="18" />
          Категории и фильтры
        </button>
      </div>
    </div>

    <div class="container catalog-page__layout">
      <CatalogSidebar
        v-model="filterValues"
        v-model:garage-fit="garageFit"
        v-model:garage-vehicle-id="garageVehicleId"
        :categories="catalogCategories"
        :active-slug="categorySlug"
        :filters="category.filters"
        class="catalog-page__sidebar"
        :class="{ 'catalog-page__sidebar--open': mobileSidebarOpen }"
        @select-category="setCategory"
      />

      <div class="catalog-page__main">
        <CatalogToolbar
          v-model:search="search"
          v-model:sort="sort"
          :total-count="totalCount"
          @reset="resetFilters"
        />

        <div v-if="paginatedList.length" class="catalog-page__grid">
          <CatalogProductCard
            v-for="product in paginatedList"
            :key="product.id"
            :product="product"
          />
        </div>

        <div v-else class="catalog-page__empty">
          <UiAppIcon name="lucide:package-x" :size="48" />
          <p>Ничего не найдено. Измените фильтры или поисковый запрос.</p>
          <button type="button" class="btn btn--primary" @click="resetFilters">
            Сбросить фильтры
          </button>
        </div>

        <CatalogPagination
          :page="page"
          :total-pages="totalPages"
          @update:page="setPage"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  padding-bottom: 3rem;
}

.catalog-page__head {
  padding-block: 1.5rem 1rem;
}

.catalog-page__breadcrumbs {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.catalog-page__breadcrumbs a:hover {
  color: var(--color-primary);
}

.catalog-page__title-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.catalog-page__title {
  margin: 0 0 0.35rem;
  font-size: clamp(1.5rem, 3vw, 2rem);
  font-weight: 800;
}

.catalog-page__desc {
  margin: 0;
  color: var(--color-text-muted);
}

.catalog-page__sidebar-toggle {
  display: none;
  gap: 0.4rem;
  flex-shrink: 0;
}

.catalog-page__layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 1.75rem;
  align-items: start;
}

.catalog-page__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

.catalog-page__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--color-text-muted);
}

@media (max-width: 1100px) {
  .catalog-page__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .catalog-page__layout {
    grid-template-columns: 1fr;
  }

  .catalog-page__sidebar-toggle {
    display: inline-flex;
  }

  .catalog-page__sidebar {
    display: none;
  }

  .catalog-page__sidebar--open {
    display: block;
  }
}

@media (max-width: 520px) {
  .catalog-page__grid {
    grid-template-columns: 1fr;
  }
}
</style>
