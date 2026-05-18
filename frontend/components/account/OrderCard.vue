<script setup lang="ts">
import type { Order } from '~/data/orders'
import { deliveryLabels, formatOrderDate, formatPrice } from '~/data/orders'

defineProps<{
  order: Order
}>()
</script>

<template>
  <article class="order-card">
    <div class="order-card__head">
      <div>
        <NuxtLink :to="`/account/orders/${order.id}`" class="order-card__number">
          {{ order.number }}
        </NuxtLink>
        <time class="order-card__date" :datetime="order.createdAt">
          {{ formatOrderDate(order.createdAt) }}
        </time>
      </div>
      <AccountOrderStatusBadge :status="order.status" />
    </div>

    <ul class="order-card__items">
      <li v-for="item in order.items.slice(0, 3)" :key="item.productId">
        <span>{{ item.name }}</span>
        <span>× {{ item.quantity }}</span>
      </li>
      <li v-if="order.items.length > 3" class="order-card__more">
        ещё {{ order.items.length - 3 }} поз.
      </li>
    </ul>

    <div class="order-card__foot">
      <span class="order-card__delivery">
        <UiAppIcon name="lucide:truck" :size="16" />
        {{ deliveryLabels[order.deliveryMethod] }}
      </span>
      <span class="order-card__total">{{ formatPrice(order.total) }}</span>
    </div>

    <NuxtLink :to="`/account/orders/${order.id}`" class="order-card__link">
      Подробнее
      <UiAppIcon name="lucide:arrow-right" :size="16" />
    </NuxtLink>
  </article>
</template>

<style scoped>
.order-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem 1.35rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  transition: box-shadow 0.2s, border-color 0.2s;
}

.order-card:hover {
  border-color: rgba(232, 93, 4, 0.35);
  box-shadow: var(--shadow-md);
}

.order-card__head {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  flex-wrap: wrap;
}

.order-card__number {
  font-size: 1.05rem;
  font-weight: 800;
  color: var(--color-accent);
}

.order-card__number:hover {
  color: var(--color-primary);
}

.order-card__date {
  display: block;
  margin-top: 0.2rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.order-card__items {
  margin: 0;
  padding: 0;
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.order-card__items li {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.order-card__items li span:first-child {
  color: var(--color-text);
  font-weight: 600;
}

.order-card__more {
  font-style: italic;
}

.order-card__foot {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding-top: 0.85rem;
  border-top: 1px solid var(--color-border);
}

.order-card__delivery {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.82rem;
  color: var(--color-text-muted);
}

.order-card__total {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--color-accent);
}

.order-card__link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  align-self: flex-start;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-primary);
}
</style>
