<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'

defineProps<{
  products: CatalogProduct[]
  categorySlug: string
}>()
</script>

<template>
  <section v-if="products.length" class="related section">
    <div class="container">
      <h2 class="related__title">Вам может понравиться</h2>
      <div class="related__grid">
        <CatalogProductCard
          v-for="product in products"
          :key="product.id"
          :product="product"
        />
      </div>
    </div>
  </section>
</template>

<style scoped>
.related {
  padding-block: 2.5rem;
  background: var(--color-bg);
}

.related__title {
  margin: 0 0 1.5rem;
  font-size: 1.5rem;
  font-weight: 800;
}

.related__grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

@media (max-width: 1100px) {
  .related__grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 520px) {
  .related__grid {
    grid-template-columns: 1fr;
  }
}
</style>
