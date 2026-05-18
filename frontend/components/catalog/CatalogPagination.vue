<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  'update:page': [value: number]
}>()

const pages = computed(() => {
  const list: (number | 'ellipsis')[] = []
  const total = props.totalPages
  const current = props.page

  if (total <= 7) {
    for (let i = 1; i <= total; i++) list.push(i)
    return list
  }

  list.push(1)
  if (current > 3) list.push('ellipsis')
  for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
    list.push(i)
  }
  if (current < total - 2) list.push('ellipsis')
  list.push(total)
  return list
})

function go(p: number) {
  emit('update:page', p)
}
</script>

<template>
  <nav v-if="totalPages > 1" class="catalog-pagination" aria-label="Пагинация">
    <button
      type="button"
      class="catalog-pagination__btn"
      :disabled="page <= 1"
      @click="go(page - 1)"
    >
      <UiAppIcon name="lucide:chevron-left" :size="18" />
    </button>

    <template v-for="(p, idx) in pages" :key="`${p}-${idx}`">
      <span v-if="p === 'ellipsis'" class="catalog-pagination__dots">…</span>
      <button
        v-else
        type="button"
        class="catalog-pagination__btn"
        :class="{ 'catalog-pagination__btn--active': p === page }"
        @click="go(p)"
      >
        {{ p }}
      </button>
    </template>

    <button
      type="button"
      class="catalog-pagination__btn"
      :disabled="page >= totalPages"
      @click="go(page + 1)"
    >
      <UiAppIcon name="lucide:chevron-right" :size="18" />
    </button>
  </nav>
</template>

<style scoped>
.catalog-pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  margin-top: 2rem;
}

.catalog-pagination__btn {
  display: grid;
  place-items: center;
  min-width: 40px;
  height: 40px;
  padding: 0 0.5rem;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  font-weight: 600;
  cursor: pointer;
  transition: border-color 0.2s, background 0.2s;
}

.catalog-pagination__btn:hover:not(:disabled) {
  border-color: var(--color-primary);
}

.catalog-pagination__btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.catalog-pagination__btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.catalog-pagination__dots {
  padding: 0 0.25rem;
  color: var(--color-text-muted);
}
</style>
