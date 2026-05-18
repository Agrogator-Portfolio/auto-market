<script setup lang="ts">
import type { OrderLineItem } from '~/data/orders'
import { formatPrice } from '~/data/orders'
import { getCategoryBySlug } from '~/data/catalog'

const props = defineProps<{
  items: OrderLineItem[]
  subtotal: number
}>()

const positionsCount = computed(() => props.items.length)
const unitsCount = computed(() =>
  props.items.reduce((sum, i) => sum + i.quantity, 0),
)

function productLink(item: OrderLineItem) {
  return `/catalog/${item.categorySlug}/${item.productId}`
}

function categoryFor(item: OrderLineItem) {
  return getCategoryBySlug(item.categorySlug)
}
</script>

<template>
  <section class="order-composition">
    <header class="order-composition__head">
      <div class="order-composition__title-wrap">
        <span class="order-composition__icon" aria-hidden="true">
          <UiAppIcon name="lucide:package-open" :size="22" />
        </span>
        <div>
          <h2 class="order-composition__title">Состав заказа</h2>
          <p class="order-composition__subtitle">
            {{ positionsCount }}
            {{ positionsCount === 1 ? 'позиция' : positionsCount < 5 ? 'позиции' : 'позиций' }}
            · {{ unitsCount }} {{ unitsCount === 1 ? 'единица' : unitsCount < 5 ? 'единицы' : 'единиц' }}
          </p>
        </div>
      </div>
      <div class="order-composition__head-total">
        <span class="order-composition__head-label">Сумма товаров</span>
        <strong>{{ formatPrice(subtotal) }}</strong>
      </div>
    </header>

    <ul class="order-composition__list">
      <li
        v-for="(item, index) in items"
        :key="`${item.productId}-${item.sku}`"
        class="order-composition__item"
      >
        <span class="order-composition__index">{{ index + 1 }}</span>

        <NuxtLink :to="productLink(item)" class="order-composition__media">
          <UiImagePlaceholder compact text="Фото" />
        </NuxtLink>

        <div class="order-composition__body">
          <div class="order-composition__meta">
            <span v-if="categoryFor(item)" class="order-composition__cat">
              <UiAppIcon :name="categoryFor(item)!.icon" :size="12" />
              {{ categoryFor(item)!.name }}
            </span>
            <span class="order-composition__brand">{{ item.brand }}</span>
          </div>
          <h3 class="order-composition__name">
            <NuxtLink :to="productLink(item)">{{ item.name }}</NuxtLink>
          </h3>
          <p class="order-composition__sku">
            <UiAppIcon name="lucide:barcode" :size="12" />
            {{ item.sku }}
          </p>
        </div>

        <div class="order-composition__pricing">
          <span class="order-composition__qty">
            <UiAppIcon name="lucide:hash" :size="13" />
            {{ item.quantity }} шт.
          </span>
          <span class="order-composition__unit">
            {{ formatPrice(item.price) }} / шт.
          </span>
          <span class="order-composition__line-total">
            {{ formatPrice(item.price * item.quantity) }}
          </span>
        </div>
      </li>
    </ul>

    <footer class="order-composition__foot">
      <span>
        <UiAppIcon name="lucide:layers" :size="16" />
        Итого по товарам
      </span>
      <strong>{{ formatPrice(subtotal) }}</strong>
    </footer>
  </section>
</template>

<style scoped>
.order-composition {
  padding: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.order-composition__head {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.25rem 1.35rem;
  background: linear-gradient(135deg, var(--color-accent) 0%, #1e293b 100%);
  color: #fff;
}

.order-composition__title-wrap {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.order-composition__icon {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.12);
  color: var(--color-primary);
}

.order-composition__title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 800;
}

.order-composition__subtitle {
  margin: 0.2rem 0 0;
  font-size: 0.8rem;
  opacity: 0.75;
}

.order-composition__head-total {
  text-align: right;
}

.order-composition__head-label {
  display: block;
  font-size: 0.72rem;
  opacity: 0.75;
  margin-bottom: 0.15rem;
}

.order-composition__head-total strong {
  font-size: 1.25rem;
  font-weight: 800;
  color: #fbbf24;
}

.order-composition__list {
  margin: 0;
  padding: 0.5rem 0;
  list-style: none;
}

.order-composition__item {
  display: grid;
  grid-template-columns: 28px 88px minmax(0, 1fr) auto;
  gap: 0.85rem 1rem;
  align-items: start;
  padding: 1rem 1.35rem;
  border-bottom: 1px solid var(--color-border);
  transition: background 0.15s;
}

.order-composition__item:hover {
  background: rgba(232, 93, 4, 0.04);
}

.order-composition__item:last-child {
  border-bottom: none;
}

.order-composition__index {
  padding-top: 0.55rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: var(--color-text-muted);
  text-align: center;
}

.order-composition__media {
  display: block;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
}

.order-composition__media :deep(.image-placeholder) {
  min-height: 72px;
  padding: 0.4rem;
}

.order-composition__media :deep(.image-placeholder__text) {
  display: none;
}

.order-composition__media :deep(.image-placeholder__icon-wrap) {
  width: 36px;
  height: 36px;
}

.order-composition__body {
  min-width: 0;
}

.order-composition__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.35rem;
}

.order-composition__cat {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.68rem;
  font-weight: 700;
  background: var(--color-accent);
  color: #fff;
}

.order-composition__brand {
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
}

.order-composition__name {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
}

.order-composition__name a:hover {
  color: var(--color-primary);
}

.order-composition__sku {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.order-composition__pricing {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.25rem;
  padding-top: 0.25rem;
}

.order-composition__qty {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.order-composition__unit {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.order-composition__line-total {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-accent);
}

.order-composition__foot {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.9rem 1.35rem;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  font-size: 0.88rem;
  font-weight: 600;
  color: var(--color-text-muted);
}

.order-composition__foot span {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.order-composition__foot strong {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-accent);
}

@media (max-width: 640px) {
  .order-composition__item {
    grid-template-columns: 24px 72px 1fr;
    grid-template-rows: auto auto;
  }

  .order-composition__pricing {
    grid-column: 2 / -1;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-top: 0.5rem;
    border-top: 1px dashed var(--color-border);
  }

  .order-composition__head-total {
    width: 100%;
    text-align: left;
    padding-top: 0.5rem;
    border-top: 1px solid rgba(255, 255, 255, 0.15);
  }
}
</style>
