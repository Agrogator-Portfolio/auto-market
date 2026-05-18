<script setup lang="ts">
import type { CatalogCategory, CatalogFilterDef, FilterValues } from '~/data/catalog'

defineProps<{
  categories: CatalogCategory[]
  activeSlug: string
  filters: CatalogFilterDef[]
}>()

const filterValues = defineModel<FilterValues>({ required: true })
const garageFit = defineModel<boolean>('garageFit', { default: false })
const garageVehicleId = defineModel<string>('garageVehicleId', { default: '' })

const emit = defineEmits<{
  selectCategory: [slug: string]
}>()
</script>

<template>
  <aside class="catalog-sidebar">
    <div class="catalog-sidebar__panel">
      <section class="catalog-sidebar__categories">
        <h2 class="catalog-sidebar__heading">
          <UiAppIcon name="lucide:layout-grid" :size="18" />
          Категории
        </h2>
        <ul class="catalog-sidebar__cat-list">
          <li v-for="cat in categories" :key="cat.slug">
            <button
              type="button"
              class="catalog-sidebar__cat-btn"
              :class="{ 'catalog-sidebar__cat-btn--active': cat.slug === activeSlug }"
              @click="emit('selectCategory', cat.slug)"
            >
              <span class="catalog-sidebar__cat-icon">
                <UiAppIcon :name="cat.icon" :size="18" />
              </span>
              <span class="catalog-sidebar__cat-name">{{ cat.name }}</span>
              <UiAppIcon
                v-if="cat.slug === activeSlug"
                name="lucide:chevron-right"
                :size="16"
                class="catalog-sidebar__cat-arrow"
              />
            </button>
          </li>
        </ul>
      </section>

      <div class="catalog-sidebar__divider" />

      <CatalogGarageFilter
        v-model:enabled="garageFit"
        v-model:vehicle-id="garageVehicleId"
      />

      <CatalogFilters
        :key="activeSlug"
        v-model="filterValues"
        :filters="filters"
        class="catalog-sidebar__filters"
      />
    </div>
  </aside>
</template>

<style scoped>
.catalog-sidebar__panel {
  padding: 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.catalog-sidebar__heading {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.85rem;
  font-size: 0.95rem;
  font-weight: 800;
  color: var(--color-accent);
}

.catalog-sidebar__cat-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.catalog-sidebar__cat-btn {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  width: 100%;
  padding: 0.6rem 0.7rem;
  border: 1.5px solid transparent;
  border-radius: var(--radius-sm);
  background: transparent;
  font: inherit;
  font-size: 0.88rem;
  font-weight: 600;
  text-align: left;
  color: var(--color-text);
  cursor: pointer;
  transition: background 0.15s, border-color 0.15s, box-shadow 0.15s;
}

.catalog-sidebar__cat-btn:hover {
  background: var(--color-primary-soft);
  border-color: rgba(232, 93, 4, 0.2);
}

.catalog-sidebar__cat-btn--active {
  background: linear-gradient(135deg, var(--color-primary) 0%, #f97316 100%);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 14px rgba(232, 93, 4, 0.35);
}

.catalog-sidebar__cat-btn--active:hover {
  background: linear-gradient(135deg, var(--color-primary) 0%, #f97316 100%);
  color: #fff;
}

.catalog-sidebar__cat-icon {
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: var(--color-bg);
  flex-shrink: 0;
}

.catalog-sidebar__cat-btn--active .catalog-sidebar__cat-icon {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

.catalog-sidebar__cat-name {
  flex: 1;
}

.catalog-sidebar__cat-arrow {
  opacity: 0.9;
}

.catalog-sidebar__divider {
  height: 1px;
  margin: 1.15rem 0;
  background: linear-gradient(90deg, transparent, var(--color-border), transparent);
}

.catalog-sidebar__filters :deep(.catalog-filters__head) {
  margin-bottom: 0.85rem;
}
</style>
