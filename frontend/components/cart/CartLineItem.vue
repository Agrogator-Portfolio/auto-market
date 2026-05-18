<script setup lang="ts">
import type { CartLineView } from '~/composables/useCart'
import { formatPrice, getCategoryBySlug } from '~/data/catalog'

const props = defineProps<{
  line: CartLineView
  index: number
}>()

const emit = defineEmits<{
  updateQuantity: [qty: number]
  remove: []
}>()

const productLink = computed(
  () => `/catalog/${props.line.product.categorySlug}/${props.line.product.id}`,
)

const category = computed(() => getCategoryBySlug(props.line.product.categorySlug))

const lineDiscount = computed(() => {
  const p = props.line.product
  if (!p.oldPrice) return 0
  return (p.oldPrice - p.price) * props.line.quantity
})
</script>

<template>
  <article class="cart-item">
    <span class="cart-item__num">{{ index }}</span>

    <NuxtLink :to="productLink" class="cart-item__media">
      <UiImagePlaceholder compact text="Фото" />
      <span v-if="line.product.oldPrice" class="cart-item__sale">
        −{{ Math.round((1 - line.product.price / line.product.oldPrice) * 100) }}%
      </span>
    </NuxtLink>

    <div class="cart-item__body">
      <div class="cart-item__meta">
        <span v-if="category" class="cart-item__cat">
          <UiAppIcon :name="category.icon" :size="12" />
          {{ category.name }}
        </span>
        <span class="cart-item__brand">{{ line.product.brand }}</span>
      </div>
      <h3 class="cart-item__title">
        <NuxtLink :to="productLink">{{ line.product.name }}</NuxtLink>
      </h3>
      <p class="cart-item__codes">
        <span>{{ line.product.sku }}</span>
        <span>·</span>
        <span>OEM {{ line.product.oem }}</span>
      </p>
      <span
        class="cart-item__stock"
        :class="{ 'cart-item__stock--backorder': !line.product.inStock }"
      >
        {{ line.product.inStock ? 'В наличии' : 'Под заказ' }}
      </span>
    </div>

    <div class="cart-item__actions">
      <div class="cart-item__price-block">
        <span class="cart-item__price">{{ formatPrice(line.product.price) }}</span>
        <span v-if="line.product.oldPrice" class="cart-item__price-old">
          {{ formatPrice(line.product.oldPrice) }}
        </span>
      </div>

      <div class="cart-item__stepper">
        <button
          type="button"
          aria-label="Меньше"
          :disabled="line.quantity <= 1"
          @click="emit('updateQuantity', line.quantity - 1)"
        >
          <UiAppIcon name="lucide:minus" :size="16" />
        </button>
        <input
          :value="line.quantity"
          type="number"
          min="1"
          max="99"
          @change="emit('updateQuantity', Math.max(1, Number(($event.target as HTMLInputElement).value) || 1))"
        />
        <button type="button" aria-label="Больше" @click="emit('updateQuantity', line.quantity + 1)">
          <UiAppIcon name="lucide:plus" :size="16" />
        </button>
      </div>

      <div class="cart-item__line-total">
        <span class="cart-item__total-label">Сумма</span>
        <span class="cart-item__total">{{ formatPrice(line.lineTotal) }}</span>
      </div>

      <button type="button" class="cart-item__remove" @click="emit('remove')">
        <UiAppIcon name="lucide:trash-2" :size="16" />
        Удалить
      </button>
    </div>
  </article>
</template>

<style scoped>
.cart-item {
  display: grid;
  grid-template-columns: 28px 112px minmax(0, 1fr) auto;
  gap: 1rem 1.25rem;
  align-items: start;
  padding: 1.15rem 1.25rem;
  border-bottom: 1px solid var(--color-border);
}

.cart-item:last-child {
  border-bottom: none;
}

.cart-item__num {
  padding-top: 0.5rem;
  font-size: 0.8rem;
  font-weight: 800;
  color: var(--color-text-muted);
  text-align: center;
}

.cart-item__media {
  position: relative;
  display: block;
  width: 112px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 1px solid var(--color-border);
  background: var(--color-bg);
  flex-shrink: 0;
}

.cart-item__media :deep(.image-placeholder) {
  min-height: 84px;
  padding: 0.5rem;
}

.cart-item__media :deep(.image-placeholder__text) {
  display: none;
}

.cart-item__media :deep(.image-placeholder__icon-wrap) {
  width: 40px;
  height: 40px;
}

.cart-item__sale {
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 1;
  padding: 0.2rem 0.45rem;
  border-radius: 4px;
  font-size: 0.65rem;
  font-weight: 800;
  background: var(--color-primary);
  color: #fff;
}

.cart-item__body {
  min-width: 0;
}

.cart-item__meta {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.35rem;
}

.cart-item__cat {
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

.cart-item__brand {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--color-text-muted);
  text-transform: uppercase;
}

.cart-item__title {
  margin: 0 0 0.35rem;
  font-size: 0.95rem;
  font-weight: 700;
  line-height: 1.35;
  word-break: break-word;
}

.cart-item__title a:hover {
  color: var(--color-primary);
}

.cart-item__codes {
  margin: 0 0 0.4rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  word-break: break-all;
}

.cart-item__stock {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-success);
}

.cart-item__stock--backorder {
  color: #b45309;
}

.cart-item__actions {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.65rem;
  flex-shrink: 0;
  min-width: 140px;
}

.cart-item__price-block {
  text-align: right;
}

.cart-item__price {
  display: block;
  font-size: 1rem;
  font-weight: 800;
}

.cart-item__price-old {
  font-size: 0.78rem;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.cart-item__stepper {
  display: inline-flex;
  align-items: center;
  border: 1.5px solid var(--color-border);
  border-radius: var(--radius-sm);
  background: var(--color-bg);
  overflow: hidden;
}

.cart-item__stepper button {
  display: grid;
  place-items: center;
  width: 34px;
  height: 34px;
  border: none;
  background: var(--color-surface);
  color: var(--color-accent);
  cursor: pointer;
}

.cart-item__stepper button:hover:not(:disabled) {
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.cart-item__stepper button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.cart-item__stepper input {
  width: 2.25rem;
  border: none;
  border-left: 1px solid var(--color-border);
  border-right: 1px solid var(--color-border);
  background: transparent;
  text-align: center;
  font-weight: 800;
  font-size: 0.9rem;
}

.cart-item__line-total {
  text-align: right;
}

.cart-item__total-label {
  display: block;
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.cart-item__total {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--color-accent);
}

.cart-item__remove {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0;
  border: none;
  background: none;
  font: inherit;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
  cursor: pointer;
}

.cart-item__remove:hover {
  color: #dc2626;
}

@media (max-width: 768px) {
  .cart-item {
    grid-template-columns: 28px 96px 1fr;
    grid-template-rows: auto auto;
  }

  .cart-item__actions {
    grid-column: 2 / -1;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    min-width: 0;
    width: 100%;
  }

  .cart-item__media {
    width: 96px;
  }
}
</style>
