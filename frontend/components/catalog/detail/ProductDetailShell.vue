<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'
import { formatPrice, getCategoryBySlug } from '~/data/catalog'

const props = defineProps<{
  product: CatalogProduct
}>()

const category = computed(() => getCategoryBySlug(props.product.categorySlug))

const activeThumb = ref(0)
const thumbs = computed(() => [0, 1, 2, 3])

const discountPercent = computed(() => {
  if (!props.product.oldPrice) return null
  return Math.round((1 - props.product.price / props.product.oldPrice) * 100)
})

const trustItems = [
  { icon: 'lucide:truck', title: 'Доставка 1–3 дня', text: 'По России, СДЭК и Почта' },
  { icon: 'lucide:shield-check', title: 'Гарантия 24 мес.', text: 'На большинство позиций' },
  { icon: 'lucide:refresh-cw', title: 'Возврат 14 дней', text: 'При сохранении товарного вида' },
]
</script>

<template>
  <div class="product-detail">
    <div class="product-detail__hero-bg" aria-hidden="true" />

    <div class="container">
      <nav class="product-detail__breadcrumbs">
        <NuxtLink to="/">Главная</NuxtLink>
        <UiAppIcon name="lucide:chevron-right" :size="14" />
        <NuxtLink :to="{ path: '/catalog', query: { category: product.categorySlug } }">
          {{ category?.name }}
        </NuxtLink>
        <UiAppIcon name="lucide:chevron-right" :size="14" />
        <span class="product-detail__crumb-current">{{ product.name }}</span>
      </nav>

      <div class="product-detail__layout">
        <div class="product-detail__gallery-col">
          <div class="product-detail__gallery">
            <span v-if="discountPercent" class="product-detail__discount">−{{ discountPercent }}%</span>
            <UiImagePlaceholder fill text="Фото товара" />
          </div>
          <div class="product-detail__thumbs">
            <button
              v-for="i in thumbs"
              :key="i"
              type="button"
              class="product-detail__thumb"
              :class="{ 'product-detail__thumb--active': activeThumb === i }"
              @click="activeThumb = i"
            >
              <UiImagePlaceholder fill />
            </button>
          </div>
        </div>

        <div class="product-detail__buy-card">
          <span class="product-detail__brand">{{ product.brand }}</span>
          <h1 class="product-detail__title">{{ product.name }}</h1>

          <div class="product-detail__meta">
            <span class="product-detail__rating">
              <UiAppIcon name="lucide:star" :size="16" />
              {{ product.rating.toFixed(1) }}
              <span>({{ product.reviewsCount }})</span>
            </span>
            <span class="product-detail__code">
              <UiAppIcon name="lucide:barcode" :size="14" />
              {{ product.sku }}
            </span>
            <span class="product-detail__code">OEM {{ product.oem }}</span>
          </div>

          <div class="product-detail__price-block">
            <div class="product-detail__prices">
              <span class="product-detail__price">{{ formatPrice(product.price) }}</span>
              <span v-if="product.oldPrice" class="product-detail__old-price">
                {{ formatPrice(product.oldPrice) }}
              </span>
            </div>
            <span
              class="product-detail__stock"
              :class="{ 'product-detail__stock--out': !product.inStock }"
            >
              <UiAppIcon :name="product.inStock ? 'lucide:check-circle' : 'lucide:clock'" :size="14" />
              {{ product.inStock ? 'В наличии на складе' : 'Под заказ 3–7 дней' }}
            </span>
          </div>

          <slot name="summary-extra" />

          <p class="product-detail__desc">{{ product.description }}</p>

          <div class="product-detail__actions">
            <CartProductCartControl
              :product-id="product.id"
              primary
              go-to-cart-on-add
              class="product-detail__cart-control"
            />
            <button type="button" class="btn btn--outline btn--lg">
              <UiAppIcon name="lucide:heart" :size="20" />
            </button>
          </div>

          <div class="product-detail__vin-hint">
            <UiAppIcon name="lucide:car" :size="18" />
            <span>Укажите VIN в личном кабинете — проверим совместимость перед отгрузкой</span>
          </div>
        </div>
      </div>

      <ul class="product-detail__trust">
        <li v-for="item in trustItems" :key="item.title">
          <span class="product-detail__trust-icon">
            <UiAppIcon :name="item.icon" :size="20" />
          </span>
          <div>
            <strong>{{ item.title }}</strong>
            <span>{{ item.text }}</span>
          </div>
        </li>
      </ul>

      <section class="product-detail__specs">
        <header class="product-detail__specs-head">
          <h2>
            <UiAppIcon name="lucide:clipboard-list" :size="22" />
            Характеристики
          </h2>
          <p>Подбор по VIN и OEM доступен после регистрации</p>
        </header>
        <div class="product-detail__specs-body">
          <slot />
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
.product-detail {
  position: relative;
  padding-bottom: 3rem;
}

.product-detail__hero-bg {
  position: absolute;
  inset: 0 0 auto;
  height: 320px;
  background: linear-gradient(
    165deg,
    var(--color-accent) 0%,
    #2d4a6f 45%,
    var(--color-bg) 100%
  );
  pointer-events: none;
}

.product-detail__breadcrumbs {
  position: relative;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.35rem;
  padding-block: 1.25rem 1.5rem;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.75);
}

.product-detail__breadcrumbs a:hover {
  color: #fff;
}

.product-detail__crumb-current {
  color: #fff;
  font-weight: 600;
  max-width: min(100%, 280px);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.product-detail__layout {
  position: relative;
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, 0.9fr);
  gap: 2rem;
  align-items: start;
}

.product-detail__gallery {
  position: relative;
  min-height: 380px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: var(--shadow-lg);
  background: var(--color-surface);
}

.product-detail__discount {
  position: absolute;
  top: 1rem;
  left: 1rem;
  z-index: 2;
  padding: 0.35rem 0.65rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 800;
  background: var(--color-primary);
  color: #fff;
}

.product-detail__thumbs {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.65rem;
  margin-top: 0.85rem;
}

.product-detail__thumb {
  position: relative;
  aspect-ratio: 1;
  padding: 0;
  border: 2px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--color-surface);
  cursor: pointer;
  transition: border-color 0.15s, box-shadow 0.15s;
}

.product-detail__thumb--active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-soft);
}

.product-detail__buy-card {
  position: sticky;
  top: calc(var(--header-h) + 1rem);
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-md);
}

.product-detail__brand {
  display: inline-block;
  margin-bottom: 0.35rem;
  padding: 0.2rem 0.55rem;
  border-radius: 6px;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.product-detail__title {
  margin: 0 0 0.75rem;
  font-size: clamp(1.35rem, 2.5vw, 1.75rem);
  font-weight: 800;
  line-height: 1.25;
}

.product-detail__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 0.85rem;
  margin-bottom: 1rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.product-detail__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  border-radius: 6px;
  background: #fffbeb;
  color: #b45309;
  font-weight: 700;
}

.product-detail__rating span {
  font-weight: 500;
  color: var(--color-text-muted);
}

.product-detail__code {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
}

.product-detail__price-block {
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-surface-muted) 100%);
}

.product-detail__prices {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.65rem;
  margin-bottom: 0.5rem;
}

.product-detail__price {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-accent);
  letter-spacing: -0.02em;
}

.product-detail__old-price {
  font-size: 1rem;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.product-detail__stock {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--color-success);
}

.product-detail__stock--out {
  color: var(--color-text-muted);
}

.product-detail__desc {
  margin: 0 0 1.25rem;
  font-size: 0.92rem;
  line-height: 1.65;
  color: var(--color-text-muted);
}

.product-detail__actions {
  display: flex;
  gap: 0.65rem;
}

.product-detail__cart-control {
  flex: 1;
}

.product-detail__btn-cart {
  flex: 1;
}

.product-detail__vin-hint {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  margin-top: 1rem;
  padding: 0.75rem 0.85rem;
  border-radius: var(--radius-sm);
  background: var(--color-primary-soft);
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-accent);
  line-height: 1.45;
}

.product-detail__trust {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin: 2rem 0 0;
  padding: 0;
  list-style: none;
}

.product-detail__trust li {
  display: flex;
  gap: 0.75rem;
  padding: 1rem 1.15rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

.product-detail__trust-icon {
  display: grid;
  place-items: center;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  border-radius: 10px;
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.product-detail__trust strong {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.15rem;
}

.product-detail__trust span {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.product-detail__specs {
  margin-top: 2.5rem;
}

.product-detail__specs-head {
  margin-bottom: 1.25rem;
}

.product-detail__specs-head h2 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 0 0.35rem;
  font-size: 1.35rem;
  font-weight: 800;
  color: var(--color-accent);
}

.product-detail__specs-head p {
  margin: 0;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.product-detail__specs-body :deep(.detail-specs),
.product-detail__specs-body :deep(.detail-specs--brakes),
.product-detail__specs-body :deep(.detail-specs--suspension),
.product-detail__specs-body :deep(.detail-specs--electrics) {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

@media (max-width: 960px) {
  .product-detail__layout {
    grid-template-columns: 1fr;
  }

  .product-detail__buy-card {
    position: static;
  }

  .product-detail__trust {
    grid-template-columns: 1fr;
  }

  .product-detail__gallery {
    min-height: 280px;
  }
}

@media (max-width: 520px) {
  .product-detail__thumbs {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
