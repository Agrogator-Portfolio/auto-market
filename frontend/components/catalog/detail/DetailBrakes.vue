<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'
import ProductDetailShell from './ProductDetailShell.vue'

defineProps<{ product: CatalogProduct }>()

const partLabels: Record<string, string> = {
  pads: 'Колодки',
  discs: 'Диски',
  fluid: 'Жидкость',
  caliper: 'Суппорт',
}

const axleLabels: Record<string, string> = {
  front: 'Передняя ось',
  rear: 'Задняя ось',
}
</script>

<template>
  <ProductDetailShell :product="product">
    <template #summary-extra>
      <div class="brakes-badge">
        <UiAppIcon name="lucide:circle-parking" :size="18" />
        Тормозная система · {{ axleLabels[String(product.attributes.axle)] ?? 'Универсально' }}
      </div>
    </template>

    <section class="detail-specs detail-specs--brakes">
      <h2 class="detail-specs__title">
        <UiAppIcon name="lucide:circle-parking" :size="22" />
        Параметры тормозной системы
      </h2>
      <div class="brakes-visual">
        <div class="brakes-visual__item">
          <span>Тип</span>
          <strong>{{ partLabels[String(product.attributes.partType)] ?? '—' }}</strong>
        </div>
        <div class="brakes-visual__item">
          <span>Ось</span>
          <strong>{{ axleLabels[String(product.attributes.axle)] ?? '—' }}</strong>
        </div>
        <div v-if="product.attributes.partType === 'discs'" class="brakes-visual__item">
          <span>Диаметр диска</span>
          <strong>312 мм (типовой)</strong>
        </div>
        <div v-if="product.attributes.partType === 'fluid'" class="brakes-visual__item">
          <span>Класс</span>
          <strong>DOT 4</strong>
        </div>
      </div>
      <dl class="detail-specs__grid">
        <dt>Материал фрикции</dt>
        <dd>Керамика / низкий пылевой коэффициент</dd>
        <dt>Температура</dt>
        <dd>до 350°C рабочая</dd>
        <dt>Комплектность</dt>
        <dd>На ось / комплект с датчиком износа</dd>
      </dl>
    </section>
  </ProductDetailShell>
</template>

<style scoped>
.brakes-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.5rem 0.85rem;
  background: #fef2f2;
  color: #b91c1c;
  border-radius: var(--radius-sm);
  font-weight: 700;
  font-size: 0.88rem;
}

.detail-specs--brakes {
  padding: 1.5rem;
  background: linear-gradient(135deg, #fff 0%, #fef2f2 100%);
  border: 1px solid #fecaca;
  border-radius: var(--radius-md);
}

.detail-specs__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  font-size: 1.2rem;
  font-weight: 800;
  color: #b91c1c;
}

.brakes-visual {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.brakes-visual__item {
  padding: 0.85rem;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid #fecaca;
}

.brakes-visual__item span {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.brakes-visual__item strong {
  font-size: 0.95rem;
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

@media (max-width: 600px) {
  .detail-specs__grid {
    grid-template-columns: 1fr;
  }
}
</style>
