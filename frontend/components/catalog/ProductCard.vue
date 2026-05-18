<script setup lang="ts">
import type { CatalogProduct } from '~/data/catalog'
import { formatPrice, getCategoryBySlug } from '~/data/catalog'

const props = defineProps<{
  product: CatalogProduct
}>()

const productLink = computed(
  () => `/catalog/${props.product.categorySlug}/${props.product.id}`,
)

const categoryName = computed(
  () => getCategoryBySlug(props.product.categorySlug)?.name ?? props.product.categorySlug,
)

</script>

<template>
  <article class="product-card">
    <NuxtLink :to="productLink" class="product-card__image-wrap">
      <UiImagePlaceholder fill />
      <span
        v-if="product.oldPrice"
        class="product-card__badge product-card__badge--sale"
      >Акция</span>
      <span
        class="product-card__badge"
        :class="product.inStock ? 'product-card__badge--stock' : 'product-card__badge--order'"
      >
        {{ product.inStock ? 'В наличии' : 'Под заказ' }}
      </span>
      <span class="product-card__badge product-card__badge--cat">{{ categoryName }}</span>
      <span v-if="product.garageMatchLabel" class="product-card__badge product-card__badge--fit">
        Подходит для {{ product.garageMatchLabel }}
      </span>
    </NuxtLink>

    <div class="product-card__body">
      <span class="product-card__brand">{{ product.brand }}</span>
      <h3 class="product-card__name">
        <NuxtLink :to="productLink">{{ product.name }}</NuxtLink>
      </h3>
      <p class="product-card__oem">OEM: {{ product.oem }}</p>
      <div class="product-card__rating">
        <UiAppIcon name="lucide:star" :size="14" />
        {{ product.rating.toFixed(1) }}
        <span>({{ product.reviewsCount }})</span>
      </div>
      <div class="product-card__prices">
        <span class="product-card__price">{{ formatPrice(product.price) }}</span>
        <span v-if="product.oldPrice" class="product-card__old-price">
          {{ formatPrice(product.oldPrice) }}
        </span>
      </div>
      <CartProductCartControl :product-id="product.id" compact class="product-card__btn" />
    </div>
  </article>
</template>

<style scoped>
.product-card {
  display: flex;
  flex-direction: column;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  overflow: hidden;
  transition: box-shadow 0.2s, transform 0.2s;
}

.product-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.product-card__image-wrap {
  position: relative;
  display: block;
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.product-card__badge {
  position: absolute;
  top: 0.65rem;
  left: 0.65rem;
  z-index: 1;
  padding: 0.25rem 0.55rem;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  background: var(--color-text-muted);
  color: #fff;
}

.product-card__badge--sale {
  background: var(--color-primary);
  top: 0.65rem;
}

.product-card__badge--stock {
  top: auto;
  bottom: 0.65rem;
  background: #059669;
}

.product-card__badge--order {
  top: auto;
  bottom: 0.65rem;
}

.product-card__badge--cat {
  left: auto;
  right: 0.65rem;
  background: #1e3a5f;
  font-size: 0.68rem;
}

.product-card__badge--fit {
  left: 0.65rem;
  right: auto;
  top: 2.35rem;
  max-width: calc(100% - 1.3rem);
  background: #0f766e;
  font-size: 0.65rem;
  line-height: 1.25;
  text-align: right;
}

.product-card__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 1rem;
  gap: 0.3rem;
}

.product-card__brand {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.product-card__name {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
}

.product-card__name a:hover {
  color: var(--color-primary);
}

.product-card__oem {
  margin: 0;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.product-card__rating {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: #f59e0b;
}

.product-card__rating span {
  color: var(--color-text-muted);
  font-weight: 500;
}

.product-card__prices {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin: 0.35rem 0 0.5rem;
}

.product-card__price {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-accent);
}

.product-card__old-price {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.product-card__btn {
  margin-top: auto;
  gap: 0.4rem;
}
</style>
