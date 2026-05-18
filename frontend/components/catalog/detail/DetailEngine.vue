<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'
import ProductDetailShell from './ProductDetailShell.vue'

defineProps<{ product: CatalogProduct }>()

const partLabels: Record<string, string> = {
  'oil-filter': 'Масляный фильтр',
  'air-filter': 'Воздушный фильтр',
  'spark-plug': 'Свечи зажигания',
  'timing-belt': 'Ремень ГРМ',
  'water-pump': 'Помпа',
}
</script>

<template>
  <ProductDetailShell :product="product">
    <template #summary-extra>
      <ul class="detail-highlights">
        <li v-for="(h, i) in product.highlights" :key="i">
          <UiAppIcon name="lucide:badge-check" :size="15" />
          {{ h }}
        </li>
      </ul>
    </template>

    <section class="detail-specs">
      <h2 class="detail-specs__title">
        <UiAppIcon name="lucide:cog" :size="22" />
        Характеристики двигателя
      </h2>
      <dl class="detail-specs__grid">
        <dt>Тип детали</dt>
        <dd>{{ partLabels[String(product.attributes.partType)] ?? product.attributes.partType }}</dd>
        <dt>Ресурс ТО</dt>
        <dd>15 000 – 90 000 км (зависит от узла)</dd>
        <dt>Совместимость</dt>
        <dd>Уточняйте по VIN в личном кабинете</dd>
        <dt>Материал корпуса</dt>
        <dd>Металл / композит (по артикулу)</dd>
        <dt>Страна бренда</dt>
        <dd>Европа / Азия</dd>
      </dl>
      <div class="detail-specs__note">
        <UiAppIcon name="lucide:info" :size="18" />
        Для двигателя важно соблюдать регламент замены фильтров и ремней — укажите VIN при заказе.
      </div>
    </section>
  </ProductDetailShell>
</template>

<style scoped>
.detail-highlights {
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.detail-highlights li {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  background: var(--color-surface-muted);
  color: var(--color-accent);
}

.detail-specs {
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.detail-specs__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--color-accent);
}

.detail-specs__grid {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 0.65rem 1.5rem;
  margin: 0;
}

.detail-specs__grid dt {
  font-weight: 600;
  color: var(--color-text-muted);
  font-size: 0.9rem;
}

.detail-specs__grid dd {
  margin: 0;
  font-weight: 600;
}

.detail-specs__note {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1.25rem;
  padding: 0.85rem 1rem;
  background: var(--color-primary-soft);
  border-radius: var(--radius-sm);
  font-size: 0.88rem;
  color: var(--color-accent);
}

@media (max-width: 600px) {
  .detail-specs__grid {
    grid-template-columns: 1fr;
  }
}
</style>
