<script setup lang="ts">
import type { OrderStatus } from '~/data/orders'
import { orderStatusMeta } from '~/data/orders'

defineProps<{
  status: OrderStatus
}>()
</script>

<template>
  <span
    class="order-status"
    :class="`order-status--${orderStatusMeta[status].tone}`"
  >
    <UiAppIcon :name="orderStatusMeta[status].icon" :size="14" />
    {{ orderStatusMeta[status].label }}
  </span>
</template>

<style scoped>
.order-status {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 700;
  white-space: nowrap;
}

.order-status--neutral {
  background: var(--color-surface-muted);
  color: var(--color-text-muted);
}

.order-status--warning {
  background: #fff7ed;
  color: #c2410c;
}

.order-status--info {
  background: #eff6ff;
  color: #1d4ed8;
}

.order-status--success {
  background: #ecfdf5;
  color: var(--color-success);
}
</style>
