<script setup lang="ts">
import type { SortOption } from '~/data/catalog'
import { sortOptions } from '~/data/catalog'

defineProps<{
  totalCount: number
}>()

const search = defineModel<string>('search', { required: true })
const sort = defineModel<SortOption>('sort', { required: true })

defineEmits<{
  reset: []
}>()
</script>

<template>
  <div class="catalog-toolbar">
    <form class="catalog-toolbar__search" role="search" @submit.prevent>
      <span class="catalog-toolbar__search-icon">
        <UiAppIcon name="lucide:search" :size="20" />
      </span>
      <input
        v-model="search"
        type="search"
        placeholder="Название, OEM, артикул, бренд..."
        aria-label="Поиск в каталоге"
      />
    </form>

    <div class="catalog-toolbar__meta">
      <span class="catalog-toolbar__count">
        <UiAppIcon name="lucide:package" :size="16" />
        Найдено: <strong>{{ totalCount }}</strong>
      </span>

      <div class="catalog-toolbar__sort">
        <UiAppIcon name="lucide:arrow-up-down" :size="18" />
        <div class="catalog-toolbar__sort-pills">
          <button
            v-for="opt in sortOptions"
            :key="opt.value"
            type="button"
            class="catalog-toolbar__sort-btn"
            :class="{ 'catalog-toolbar__sort-btn--active': sort === opt.value }"
            @click="sort = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <button type="button" class="catalog-toolbar__reset" @click="$emit('reset')">
        <UiAppIcon name="lucide:rotate-ccw" :size="18" />
        Сбросить
      </button>
    </div>
  </div>
</template>

<style scoped>
.catalog-toolbar {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.25rem;
  padding: 1.15rem 1.25rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.catalog-toolbar__search {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 1rem;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-md);
  transition: border-color 0.15s, box-shadow 0.15s;
}

.catalog-toolbar__search:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(232, 93, 4, 0.12);
}

.catalog-toolbar__search-icon {
  color: var(--color-text-muted);
}

.catalog-toolbar__search input {
  flex: 1;
  border: none;
  background: transparent;
  outline: none;
  font-size: 0.95rem;
  color: var(--color-text);
}

.catalog-toolbar__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.75rem 1rem;
}

.catalog-toolbar__count {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.75rem;
  border-radius: 999px;
  background: var(--color-primary-soft);
  font-size: 0.85rem;
  color: var(--color-accent);
}

.catalog-toolbar__count strong {
  color: var(--color-primary);
}

.catalog-toolbar__sort {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex: 1;
  min-width: 0;
  color: var(--color-text-muted);
}

.catalog-toolbar__sort-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.catalog-toolbar__sort-btn {
  padding: 0.35rem 0.65rem;
  border: 1.5px solid var(--color-border);
  border-radius: 999px;
  background: var(--color-bg);
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.15s, background 0.15s, color 0.15s;
}

.catalog-toolbar__sort-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.catalog-toolbar__sort-btn--active {
  border-color: var(--color-accent);
  background: var(--color-accent);
  color: #fff;
}

.catalog-toolbar__reset {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.85rem;
  border: none;
  border-radius: var(--radius-sm);
  background: transparent;
  font: inherit;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
}

.catalog-toolbar__reset:hover {
  background: var(--color-surface-muted);
  color: var(--color-primary);
}

@media (max-width: 900px) {
  .catalog-toolbar__sort {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
