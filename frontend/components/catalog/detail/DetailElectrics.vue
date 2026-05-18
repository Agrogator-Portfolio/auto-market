<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'
import ProductDetailShell from './ProductDetailShell.vue'

defineProps<{ product: CatalogProduct }>()

const partLabels: Record<string, string> = {
  battery: 'Аккумулятор',
  alternator: 'Генератор',
  starter: 'Стартер',
  relay: 'Реле',
}
</script>

<template>
  <ProductDetailShell :product="product">
    <template #summary-extra>
      <div class="electrics-cards">
        <div v-for="(h, i) in product.highlights" :key="i" class="electrics-cards__item">
          <UiAppIcon name="lucide:zap" :size="20" />
          <span>{{ h }}</span>
        </div>
      </div>
    </template>

    <section class="detail-specs detail-specs--electrics">
      <h2 class="detail-specs__title">
        <UiAppIcon name="lucide:zap" :size="22" />
        Электрические характеристики
      </h2>
      <div class="electrics-specs">
        <div class="electrics-specs__block">
          <span class="electrics-specs__label">Тип</span>
          <span class="electrics-specs__value">
            {{ partLabels[String(product.attributes.partType)] ?? '—' }}
          </span>
        </div>
        <div class="electrics-specs__block electrics-specs__block--accent">
          <span class="electrics-specs__label">Напряжение</span>
          <span class="electrics-specs__value">{{ product.attributes.voltage }} В</span>
        </div>
        <div v-if="product.attributes.partType === 'battery'" class="electrics-specs__block">
          <span class="electrics-specs__label">Ёмкость</span>
          <span class="electrics-specs__value">60–70 А·ч</span>
        </div>
        <div v-if="product.attributes.partType === 'alternator'" class="electrics-specs__block">
          <span class="electrics-specs__label">Ток генератора</span>
          <span class="electrics-specs__value">140 А</span>
        </div>
        <div v-if="product.attributes.partType === 'starter'" class="electrics-specs__block">
          <span class="electrics-specs__label">Мощность</span>
          <span class="electrics-specs__value">1.4 кВт</span>
        </div>
      </div>
      <p class="electrics-tip">
        Перед установкой аккумулятора проверьте полярность и пусковой ток по VIN автомобиля.
      </p>
    </section>
  </ProductDetailShell>
</template>

<style scoped>
.electrics-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
  margin-top: 1rem;
}

.electrics-cards__item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.65rem 0.75rem;
  background: #fefce8;
  border: 1px solid #fde047;
  border-radius: var(--radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  color: #854d0e;
}

.detail-specs--electrics {
  padding: 1.5rem;
  background: linear-gradient(180deg, #fefce8 0%, var(--color-surface) 100%);
  border: 1px solid #fde047;
  border-radius: var(--radius-md);
}

.detail-specs__title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 1.25rem;
  font-size: 1.2rem;
  font-weight: 800;
  color: #854d0e;
}

.electrics-specs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 0.75rem;
}

.electrics-specs__block {
  padding: 1rem;
  background: var(--color-surface);
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.electrics-specs__block--accent {
  border-color: #fde047;
  background: #fffbeb;
}

.electrics-specs__label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: 0.35rem;
}

.electrics-specs__value {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-accent);
}

.electrics-tip {
  margin: 1.25rem 0 0;
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.5;
}

@media (max-width: 520px) {
  .electrics-cards {
    grid-template-columns: 1fr;
  }
}
</style>
