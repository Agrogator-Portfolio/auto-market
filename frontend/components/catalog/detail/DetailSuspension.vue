<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'
import ProductDetailShell from './ProductDetailShell.vue'

defineProps<{ product: CatalogProduct }>()

const partLabels: Record<string, string> = {
  shock: 'Амортизатор',
  spring: 'Пружина',
  bushing: 'Сайлентблок',
  arm: 'Рычаг',
}
</script>

<template>
  <ProductDetailShell :product="product">
    <template #summary-extra>
      <ul class="detail-highlights">
        <li v-for="(h, i) in product.highlights" :key="i">
          <UiAppIcon name="lucide:wrench" :size="16" />
          {{ h }}
        </li>
      </ul>
    </template>

    <section class="detail-specs detail-specs--suspension">
      <h2 class="detail-specs__title">
        <UiAppIcon name="lucide:wrench" :size="22" />
        Параметры подвески
      </h2>
      <table class="suspension-table">
        <thead>
          <tr>
            <th>Параметр</th>
            <th>Значение</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Тип детали</td>
            <td>{{ partLabels[String(product.attributes.partType)] ?? '—' }}</td>
          </tr>
          <tr>
            <td>Ось установки</td>
            <td>{{ product.attributes.axle === 'front' ? 'Передняя' : 'Задняя' }}</td>
          </tr>
          <tr>
            <td>Тип амортизатора</td>
            <td>{{ product.attributes.partType === 'shock' ? 'Газомасляный' : '—' }}</td>
          </tr>
          <tr>
            <td>Комплект</td>
            <td>Пара / штучно</td>
          </tr>
          <tr>
            <td>Гарантия</td>
            <td>24 месяца</td>
          </tr>
        </tbody>
      </table>
    </section>
  </ProductDetailShell>
</template>

<style scoped>
.detail-highlights {
  list-style: none;
  margin: 1rem 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
}

.detail-highlights li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 600;
}

.detail-specs--suspension {
  padding: 0;
  overflow: hidden;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.detail-specs__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
  padding: 1.25rem 1.5rem;
  font-size: 1.2rem;
  font-weight: 800;
  background: var(--color-accent);
  color: #fff;
}

.suspension-table {
  width: 100%;
  border-collapse: collapse;
}

.suspension-table th,
.suspension-table td {
  padding: 0.85rem 1.5rem;
  text-align: left;
  border-top: 1px solid var(--color-border);
}

.suspension-table th {
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  background: var(--color-bg);
}

.suspension-table td:last-child {
  font-weight: 700;
}
</style>
